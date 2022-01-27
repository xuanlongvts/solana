use std::str::FromStr;

use rocket::{
	get,
	response::content::Json,
	serde::json::{serde_json::json, Value},
};

use crate::establish_connection;

#[get("/")]
pub fn index() -> &'static str {
	"Hello world"
}

#[get("/<pubkey>")]
pub fn route_with_pubkey(pubkey: &str) -> String {
	format!("Hello {}", pubkey)
}
