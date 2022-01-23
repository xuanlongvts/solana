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

#[cfg(test)]
mod test {
	use super::*;
	use solana_program::{borsh::get_instance_packed_len, pubkey::Pubkey};

	#[test]
	fn test_email() {
		let mail = Email {
			id: String::from("00000000-0000-0000-0000-000000000000"),
			from_address: Pubkey::default().to_string(),
			to_address: Pubkey::default().to_string(),
			subject: String::from("Hey Long"),
			body: String::from("Body text with some character"),
			send_date: String::from("20/10/2021, 09:00:00 am"),
		};
		let mut tmp_slice = [0; 500];
		mail.serialize(&mut &mut tmp_slice[..]).unwrap(); // serialize data to Unit8Array

		// println!("tmp_slice: {:?}", tmp_slice);

		/* tmp_slice is
		[36, 0, 0, 0, 48, 48, 48, 48, 48, 48, 48, 48, 45, 48, 48, 48, 48, 45, 48, 48, 48, 48, 45, 48, 48, 48, 48, 45, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 32, 0, 0, 0, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 32, 0, 0, 0, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 8, 0, 0, 0, 72, 101, 121, 32, 76, 111, 110, 103, 29, 0, 0, 0, 66, 111, 100, 121, 32, 116, 101, 120, 116, 32, 119, 105, 116, 104, 32, 115, 111, 109, 101, 32, 99, 104, 97, 114, 97, 99, 116, 101, 114, 23, 0, 0, 0, 50, 48, 47, 49, 48, 47, 50, 48, 50, 49, 44, 32, 48, 57, 58, 48, 48, 58, 48, 48, 32, 97, 109, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		*/

		let length = get_instance_packed_len(&mail).unwrap();

		println!("state file ===> length: {:?}", length); // get length from data tmp;
		let mail = Email::try_from_slice(&tmp_slice[..length]).unwrap(); // deserialize data to text
		assert_eq!(mail.subject, "Hey Long");
	}

	#[test]
	fn test_mail_account() {
		let mail = Email {
			id: String::from("00000000-0000-0000-0000-000000000000"),
			from_address: Pubkey::default().to_string(),
			to_address: Pubkey::default().to_string(),
			subject: String::from("Hey Long"),
			body: String::from("Body text with some character"),
			send_date: String::from("20/10/2021, 09:00:00 am"),
		};
		let mail_account = EmailAccount {
			inbox: vec![mail],
			sent: Vec::new(),
		};
		let mut temp_slice = [0; 500];
		mail_account.serialize(&mut &mut temp_slice[..]).unwrap();

		let length = get_instance_packed_len(&mail_account).unwrap();
		let mail_account = EmailAccount::try_from_slice(&temp_slice[..length]).unwrap();
		assert_eq!(mail_account.inbox[0].subject, "Hey Long");
	}

	#[test]
	fn test_data_length() {
		let data_length = DataLength { length: 5 };

		let mut temp_slice = [0; 4];
		data_length.serialize(&mut &mut temp_slice[..]).unwrap();

		assert_eq!(temp_slice, [5, 0, 0, 0]);

		let data_length = DataLength::try_from_slice(&temp_slice[..4]).unwrap();
		assert_eq!(data_length.length, 5);
	}
}

// printlnt in text run with:   cargo test -- --nocapture
