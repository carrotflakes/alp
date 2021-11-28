use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{guard, http, web, App, HttpRequest, HttpResponse, HttpServer, Result};
use alp::auth::Authorize;
use alp::db::new_pool;
use alp::repository::Repository;
use alp::schema::{self, new_schema, MySchema};
use alp::usecases::Usecase;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql::Schema;
use async_graphql_actix_web::{Request, Response, WSSubscription};

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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_pool = new_pool().unwrap();
    let redis_client = new_redis().await.unwrap();
    let auth = Authorize::new().await;

    let repository = Arc::new(Repository::new(db_pool, redis_client.clone()));

    std::thread::spawn({
        // TODO: async
        let redis_client = redis_client.clone();
        let repository = repository.clone();
        || alp::subscribe::incoming_subscribe(redis_client, repository)
    });

    // actix_web::rt::spawn({
    //     let redis_client = redis_client.clone();
    //     alp::subscribe::incoming_subscribe(redis_client)
    // });

    // actix_web::rt::Arbiter::spawn_fn({
    //     let redis_client = redis_client.clone();
    //     move || alp::subscribe::incoming_subscribe(redis_client)
    // });

    // actix_web::rt::time::delay_for(std::time::Duration::from_secs(1)).await;
    // use redis::Commands;
    // redis_client.get_connection().unwrap().publish::<_, _, ()>("foo", "hey").unwrap();

    let usecase = Usecase::new(auth, repository);
    let schema = new_schema(usecase);

    println!("Playground: http://localhost:8000");

    HttpServer::new(move || {
        App::new()
            .data(schema.clone())
            .wrap(new_cors())
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

async fn new_redis() -> Result<Arc<redis::Client>, String> {
    let redis_url = std::env::var("REDIS_URL").expect("REDIS_URL is required");

    let redis_client = redis::Client::open(redis_url).map_err(|x| x.to_string())?;
    // use redis::Commands;
    // let mut redis_conn = redis_client.get_connection().map_err(|x| x.to_string())?;
    // redis_conn.set("foo", "bar").map_err(|x| x.to_string())?;
    // dbg!(redis_conn
    //     .get::<&str, String>("foo")
    //     .map_err(|x| x.to_string())?);
    Ok(Arc::new(redis_client))
}

fn new_cors() -> Cors {
    let cors_origin = std::env::var("CORS_ORIGIN").unwrap_or("*".to_owned());

    let mut cors = Cors::default()
        .allowed_methods(vec!["GET", "POST"])
        .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
        .allowed_header(http::header::CONTENT_TYPE)
        .max_age(3600);
    cors = if cors_origin == "*" {
        cors.allowed_origin(&cors_origin)
    } else {
        cors.allow_any_origin()
    };
    cors
}
