import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";
import { O2UpdateData } from "../target/types/o2_update_data";

describe("_o2_update_data", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);

    const program = anchor.workspace.O2UpdateData as Program<O2UpdateData>;
    const myAcc = anchor.web3.Keypair.generate();

    it("Is initialized!", async () => {
        const num_init = new anchor.BN(5);

        await program.rpc.initialize(num_init, {
            accounts: {
                myAccount: myAcc.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [myAcc],
        });
        const account = await program.account.myAccount.fetch(myAcc.publicKey);
        assert.ok(account.data.eq(new anchor.BN(5)));
        console.log("Data init: ", Number(account.data));
    });

    it("Is Increase!", async () => {
        const num_init = new anchor.BN(5);

        await program.rpc.increase(num_init, {
            accounts: {
                myAccount: myAcc.publicKey,
            },
        });
        const account = await program.account.myAccount.fetch(myAcc.publicKey);
        assert.ok(account.data.eq(new anchor.BN(10)));

        console.log("Data Increase: ", Number(account.data));
    });

    it("Is Decrease!", async () => {
        const num_init = new anchor.BN(2);

        await program.rpc.decrease(num_init, {
            accounts: {
                myAccount: myAcc.publicKey,
            },
        });
        const account = await program.account.myAccount.fetch(myAcc.publicKey);
        assert.ok(account.data.eq(new anchor.BN(8)));

        console.log("Data Decrease: ", Number(account.data));
    });
});
