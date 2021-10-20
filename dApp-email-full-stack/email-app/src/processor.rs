use crate::error::MailError::NotWriteable;
use crate::instruction::EMailInstruction;
use crate::state::{DataLength, Email, EmailAccount};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
	account_info::AccountInfo, borsh::get_instance_packed_len, entrypoint::ProgramResult, msg,
	program_error::ProgramError, pubkey::Pubkey,
};
use std::convert::TryFrom;

pub struct Processor;

const OFFSET: usize = 4;

impl Processor {
	pub fn process(
		program_id: &Pubkey,
		accounts: &[AccountInfo],
		instruction_data: &[u8],
	) -> ProgramResult {
		let instruction = EMailInstruction::unpack(instruction_data)?;

		match instruction {
			EMailInstruction::InitAccount => {
				msg!("Instruction: InitAccount");
				Self::process_init_account(&accounts[0], program_id)
			}
			EMailInstruction::SendEmail { mail } => {
				msg!("Instruction: Send Email");
				Self::process_send_mail(&accounts, &mail, &program_id)
			}
		}
	}

	fn process_init_account(account: &AccountInfo, program_id: &Pubkey) -> ProgramResult {
		if !account.is_writable {
			return Err(NotWriteable.into());
		}

		if account.owner != program_id {
			return Err(ProgramError::IncorrectProgramId);
		}

		let welcome_mail = Email {
			id: String::from("00000000-0000-0000-0000-000000000000"),
			from_address: program_id.to_string(),
			to_address: account.key.to_string(),
			subject: String::from("Welcome to Solana Mail"),
			body: String::from("This is the start of your private messages on SolMail
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos ut labore, debitis assumenda, dolorem nulla facere soluta exercitationem excepturi provident ipsam reprehenderit repellat quisquam corrupti commodi fugiat iusto quae voluptates!"),
			send_date: String::from("20/10/2021, 09:00:00 am")
		};

		let mail_account = EmailAccount {
			inbox: vec![welcome_mail],
			sent: Vec::new(),
		};
		let data_length = DataLength {
			length: u32::try_from(get_instance_packed_len(&mail_account)?).unwrap(),
		};

		// [data_length, mail_account, 0, 0, 0, 0, 0, ..]; structer email
		data_length.serialize(&mut &mut account.data.borrow_mut()[..OFFSET])?;
		mail_account.serialize(&mut &mut account.data.borrow_mut()[OFFSET..])?;

		Ok(())
	}

	fn process_send_mail(
		accounts: &[AccountInfo],
		email: &Email,
		program_id: &Pubkey,
	) -> ProgramResult {
		// [data_length, mail_account, 0, 0, 0, 0, 0, ..]; structer email
		let sender_account = &accounts[0];
		let receiver_account = &accounts[1];
		if !sender_account.is_writable || !receiver_account.is_writable {
			return Err(NotWriteable.into());
		}

		if sender_account.owner != program_id || receiver_account.owner != program_id {
			return Err(ProgramError::IncorrectProgramId);
		}

		// ------------ for sender_account

		// Deserialize this instance from a slice of bytes.
		let data_length = DataLength::try_from_slice(&sender_account.data.borrow()[..OFFSET])?;

		let mut sender_data;
		if data_length.length > 0 {
			let length =
				usize::try_from(data_length.length + u32::try_from(OFFSET).unwrap()).unwrap();

			// try_from_slice (Deseriallize data)
			sender_data =
				EmailAccount::try_from_slice(&sender_account.data.borrow()[OFFSET..length])?;
		} else {
			sender_data = EmailAccount {
				inbox: Vec::new(),
				sent: Vec::new(),
			};
		}
		sender_data.sent.push(email.clone());
		let data_length = DataLength {
			// Get the packed length for the serialized form of this object instance
			// get_instance_packed_len ====> OK(n);
			// try_from  ====> u32::try_from(n) = n
			length: u32::try_from(get_instance_packed_len(&sender_data)?).unwrap(),
		};
		data_length.serialize(&mut &mut sender_account.data.borrow_mut()[..OFFSET])?; // convert data
		sender_data.serialize(&mut &mut sender_account.data.borrow_mut()[OFFSET..])?;

		// ------------ for receiver_account
		let data_length = DataLength::try_from_slice(&receiver_account.data.borrow()[..OFFSET])?;

		let mut receiver_data;
		if data_length.length > 0 {
			let length =
				usize::try_from(data_length.length + u32::try_from(OFFSET).unwrap()).unwrap();

			receiver_data =
				EmailAccount::try_from_slice(&receiver_account.data.borrow()[OFFSET..length])?;
		} else {
			receiver_data = EmailAccount {
				inbox: Vec::new(),
				sent: Vec::new(),
			}
		}
		receiver_data.inbox.push(email.clone());
		let data_length = DataLength {
			length: u32::try_from(get_instance_packed_len(&receiver_data)?).unwrap(),
		};
		data_length.serialize(&mut &mut receiver_account.data.borrow_mut()[..OFFSET])?;
		receiver_data.serialize(&mut &mut receiver_account.data.borrow_mut()[OFFSET..])?;

		Ok(())
	}
}
