#![cfg(feature = "test-bpf")]

use cross_program_invocation::processor::{processor_instruction, SIZE};
use solana_program::{
	instruction::{AccountMeta, Instruction},
	pubkey::Pubkey,
	rent::Rent,
	system_program,
};
use solana_program_test::*;
use solana_sdk::{account::Account, signature::Signer, transaction::Transaction};
use std::str::FromStr;

#[tokio::test]
async fn test_cross_program_invocation() {
	let program_id = Pubkey::from_str(&"invoker111111111111111111111111111111111111").unwrap();

	let (allocated_pubkey, bump_seed) =
		Pubkey::find_program_address(&[b"You pass butter"], &program_id);

	let mut program_test = ProgramTest::new(
		"spl_example_cross_program_invocation",
		program_id,
		processor!(processor_instruction),
	);
	program_test.add_account(
		allocated_pubkey,
		Account {
			lamports: Rent::default().minimum_balance(SIZE),
			..Account::default()
		},
	);

	let (mut bank_client, payer, recent_blockhash) = program_test.start().await;
	let instr_bincode = Instruction::new_with_bincode(
		program_id,
		&[bump_seed],
		vec![
			AccountMeta::new(system_program::id(), false),
			AccountMeta::new(allocated_pubkey, false),
		],
	);
	let mut transaction = Transaction::new_with_payer(&[instr_bincode], Some(&payer.pubkey()));
	transaction.sign(&[&payer], recent_blockhash);
	bank_client.process_transaction(transaction).await.unwrap();

	// Associated account now exists
	let allocated_account = bank_client
		.get_account(allocated_pubkey)
		.await
		.expect("get_account")
		.expect("associated_account not none");
	assert_eq!(allocated_account.data.len(), SIZE);
}
