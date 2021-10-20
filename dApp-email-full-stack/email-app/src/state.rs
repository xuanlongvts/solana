use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone, PartialEq)]
pub struct Email {
	pub id: String,
	pub from_address: String,
	pub to_address: String,
	pub subject: String,
	pub body: String,
	pub send_date: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct EmailAccount {
	pub inbox: Vec<Email>,
	pub sent: Vec<Email>,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct DataLength {
	pub length: u32,
}
