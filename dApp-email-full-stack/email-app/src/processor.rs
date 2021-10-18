use crate::error::MailError::NotWriteable;
use crate::instruction::EMailInstruction;
use crate::state::{DataLength, Email, EmailAccount};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
	account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
	pubkey::Pubkey,
};

pub struct Processor;

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
		mail_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

		Ok(())
	}
}
