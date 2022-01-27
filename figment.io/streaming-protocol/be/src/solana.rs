use std::{str::FromStr, thread};

use solana_client::{pubsub_client, rpc_client::RpcClient};
use solana_sdk::{account::Account, pubkey::Pubkey};

use crate::consts::{API_DEV_NET, PUB_KEY, WS_DEV_NET};
use crate::{establish_connection, models::Stream};

fn get_all_program_accounts() -> Vec<(Pubkey, Account)> {
	let program_pubkey = Pubkey::from_str(&PUB_KEY).expect("Program address invalid");
	let url = API_DEV_NET.to_string();
	let client = RpcClient::new(url);

	client
		.get_program_accounts(&program_pubkey)
		.expect("Something went wrong")
}

pub fn get_accounts_and_update() {
	let program_accounts = get_all_program_accounts();
	let conn = establish_connection();
	for item in program_accounts.iter() {
		let stream = Stream::new(item.0.to_string(), &item.1.data);
		match stream {
			Some(i) => Stream::insert_or_update(i, &conn),
			_ => continue,
		};
	}
}

pub fn subscribe_to_program() {
	let url = WS_DEV_NET.to_string();
	let program_pubkey = Pubkey::from_str(&PUB_KEY).expect("Program address invalid");

	thread::spawn(move || loop {
		let subscription =
			pubsub_client::PubsubClient::program_subscribe(&url, &program_pubkey, None)
				.expect("Something went wrong");
		let conn = establish_connection();

		loop {
			let response = subscription.1.recv();
			match response {
				Ok(res) => {
					let pda_pubkey = res.value.pubkey;
					let pda_account: Account = res.value.account.decode().unwrap();
					let stream = Stream::new(pda_pubkey, &pda_account.data);
					match stream {
						Some(item) => Stream::insert_or_update(item, &conn),
						_ => {
							println!("Data didn't parse");
							continue;
						}
					};
				}
				Err(_) => break,
			}
		}
		get_accounts_and_update();
	});
}
