mod schema;
mod simple_broker;
use actix_cors::Cors;
use actix_web::{guard, http, web, App, HttpRequest, HttpResponse, HttpServer, Result};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{Request, Response, WSSubscription};
use schema::{MutationRoot, MySchema, QueryRoot, Storage, SubscriptionRoot};

async fn index(schema: web::Data<MySchema>, req: Request) -> Response {
    schema.execute(req.into_inner()).await.into()
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
    WSSubscription::start(Schema::clone(&*schema), &req, payload)
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let schema = Schema::build(QueryRoot, MutationRoot, SubscriptionRoot)
        .data(Storage::default())
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
