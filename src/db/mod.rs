pub mod schema;

use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2::{Error, Pool, PooledConnection};
use std::{env, sync::Arc};

pub type PgPool = Pool<ConnectionManager<PgConnection>>;
pub type PgPooled = PooledConnection<ConnectionManager<PgConnection>>;

pub fn new_pool() -> Result<Arc<PgPool>, Error> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::builder()
        .max_size(15)
        .build(manager)
        .map(|pool| Arc::new(pool))
}
