mod auth;
mod schema;
mod simple_broker;

use actix_cors::Cors;
use actix_web::{guard, http, web, App, HttpRequest, HttpResponse, HttpServer, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{Request, Response, WSSubscription};
use schema::{MutationRoot, MySchema, QueryRoot, Storage, SubscriptionRoot};

use crate::auth::Authorize;

async fn index(schema: web::Data<MySchema>, req: HttpRequest, gql_req: Request) -> Response {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|value| value.to_str().map(|s| schema::MyToken(s.to_string())).ok());
    let mut request = gql_req.into_inner();
    if let Some(token) = token {
        request = request.data(token);
    }
    schema.execute(request).await.into()
}

async fn index_playground() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(
            GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"),
        )))
}

async fn index_ws(
    schema: web::Data<MySchema>,
    req: HttpRequest,
    payload: web::Payload,
) -> Result<HttpResponse> {
    WSSubscription::start_with_initializer(Schema::clone(&*schema), &req, payload, |value| async {
        #[derive(serde_derive::Deserialize)]
        struct Payload {
            #[serde(rename = "Authorization")]
            authentication: String,
        }

        let mut data = async_graphql::Data::default();
        if let Ok(payload) = serde_json::from_value::<Payload>(value) {
            data.insert(schema::MyToken(payload.authentication));
        }
        Ok(data)
    })
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let auth = Authorize::new().await;
    let schema = Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(Storage::default())
        .data(auth)
        .finish();

    println!("Playground: http://localhost:8000");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .data(schema.clone())
            .wrap(cors)
            .service(web::resource("/").guard(guard::Post()).to(index))
            .service(
                web::resource("/")
                    .guard(guard::Get())
                    .guard(guard::Header("upgrade", "websocket"))
                    .to(index_ws),
            )
            .service(web::resource("/").guard(guard::Get()).to(index_playground))
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}
