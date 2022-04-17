import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";

import { O4ErrorManagement } from "../target/types/o4_error_management";

describe("_o4_error_management", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);

    const program = anchor.workspace
        .O4ErrorManagement as Program<O4ErrorManagement>;

    it("Is initialized!", async () => {
        await program.state.rpc.new(new anchor.BN(11), {
            accounts: {
                authority: provider.wallet.publicKey,
            },
        });
        const state = await program.state.fetch();
        console.log("state: ", Number(state.count));

        assert.ok(state.count.eq(new anchor.BN(11)));
    });

    it("Executes a method on the program.", async () => {
        await program.state.rpc.increase(new anchor.BN(5), {
            accounts: {
                authority: provider.wallet.publicKey,
                // authority: anchor.web3.Keypair.generate().publicKey, // error
            },
        });
        const state = await program.state.fetch();
        console.log("state: ", Number(state.count));

        assert.ok(state.count.eq(new anchor.BN(16)));
    });
});
