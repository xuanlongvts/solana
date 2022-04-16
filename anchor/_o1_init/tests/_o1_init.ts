import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { O1Init } from "../target/types/o1_init";

describe("_o1_init", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());

	const program = anchor.workspace.O1Init as Program<O1Init>;

	it("Is initialized!", async () => {
		// Add your test here.
		const tx = await program.methods.initialize().rpc();
		console.log("Your transaction signature", tx);
	});
});
