use std::str::FromStr;

use rocket::{
	get,
	response::content::Json,
	serde::json::{serde_json::json, Value},
};

use crate::establish_connection;
use crate::models::Stream;

#[get("/")]
pub fn index() -> &'static str {
	"Hello world"
}

#[get("/<pubkey>")]
pub fn get_all_stream(pubkey: &str) -> Json<Value> {
	let pubkey_string = String::from_str(pubkey).unwrap();
	let conn = establish_connection();

	Json(json!(
		{
			"status": "success",
			"sending": Stream::get_all_with_sender(&pubkey_string, &conn),
			"receiving": Stream::get_all_with_receiver(&pubkey_string, &conn)
		}
	))
}
