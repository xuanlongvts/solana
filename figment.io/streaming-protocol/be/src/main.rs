#[macro_use]
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

mod routes;

use rocket::routes;

use routes::{index, route_with_pubkey};

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(database_url)
        .unwrap_or_else(|_| panic!("Error connection to {}", database_url))
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cors = rocket_cors::CorsOptions::default().to_cors()?;

    rocket::build()
        .mount("/", routes![index, route_with_pubkey])
        .attach(cors)
        .launch()
        .await?;

    Ok(())
}
