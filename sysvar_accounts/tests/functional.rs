use {
	solana_program::{
		instruction::{AccountMeta, Instruction},
		pubkey::Pubkey,
		sysvar::{self},
	},
	solana_program_test::*,
	solana_sdk::{signature::Signer, transaction::Transaction},
	std::str::FromStr,
	sysvar_accounts::processor::processor_instruction,
};

#[tokio::test]
async fn test_sysvar() {
	let program_id = Pubkey::from_str("Sysvar1111111111111111111111111111111111111").unwrap();
	let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
		"spl_example_sysvar",
		program_id,
		processor!(processor_instruction),
	)
	.start()
	.await;

	let accs = vec![
		AccountMeta::new(sysvar::clock::id(), false),
		AccountMeta::new(sysvar::rent::id(), false),
	];
	let instr_bincode = Instruction::new_with_bincode(program_id, &(), accs);
	let mut transaction = Transaction::new_with_payer(&[instr_bincode], Some(&payer.pubkey()));
	transaction.sign(&[&payer], recent_blockhash);
	banks_client.process_transaction(transaction).await.unwrap();
}
