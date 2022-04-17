import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import assert from "assert";

import { O3CpiMaster } from "../target/types/o3_cpi_master";
import { O3Cpi } from "../target/types/o3_cpi";

describe("_o3_cpi", () => {
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);

    const programMaster = anchor.workspace.O3CpiMaster as Program<O3CpiMaster>;
    const program = anchor.workspace.O3Cpi as Program<O3Cpi>;

    it("Performs CPI from _o3_cpi_master to _o3_cpi.", async () => {
        // Initialize a new puppet account.
        const newPuppetAccount = anchor.web3.Keypair.generate();
        await program.rpc.initialize({
            accounts: {
                puppet: newPuppetAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [newPuppetAccount],
        });

        // Invoke the puppet master to perform a CPI to the puppet.
        await programMaster.rpc.pullStrings(new anchor.BN(111), {
            accounts: {
                puppet: newPuppetAccount.publicKey,
                puppetProgram: program.programId,
            },
        });

        // Check the state updated.
        const puppetAccount = await program.account.data.fetch(
            newPuppetAccount.publicKey
        );
        console.log("puppetAccount: ", Number(puppetAccount.data));

        assert.ok(puppetAccount.data.eq(new anchor.BN(111)));
    });
});
