use solana_program::{
	account_info::{next_account_info, AccountInfo},
	entrypoint::ProgramResult,
	pubkey::Pubkey,
};

pub fn process_instruction(
	_program_id: &Pubkey,
	accounts: &[AccountInfo],
	_instruction_data: &[u8],
) -> ProgramResult {
	let account_info_iter = &mut accounts.iter();

	let source_info = next_account_info(account_info_iter)?;
	let destination_info = next_account_info(account_info_iter)?;

	// Withdraw five lamports from the source
	**source_info.try_borrow_mut_lamports()? -= 5;

	// Deposit five lamports from the destination
	**destination_info.try_borrow_mut_lamports()? += 5;

	Ok(())
}
