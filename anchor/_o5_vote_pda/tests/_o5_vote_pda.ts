import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { O5VotePda } from "../target/types/o5_vote_pda";

describe("_o5_vote_pda", async () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.O5VotePda as Program<O5VotePda>;

    const [acc, accBump] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("seed_word")],
        program.programId
    );

    it("Is initialized!", async () => {
        await program.rpc.initialize(accBump, {
            accounts: {
                voteAcc: acc,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
        });
        // await program.rpc.initialize(num);
        const accInfor = await program.account.votingState.fetch(acc);
        console.log(
            "pizza: ",
            Number(accInfor.pizza),
            ", hambuger: ",
            Number(accInfor.hambuger)
        );
    });

    it("Vote Pizza!", async () => {
        await program.rpc.votePizza({
            accounts: {
                voteAcc: acc,
            },
        });
        const accInfor = await program.account.votingState.fetch(acc);
        console.log(
            "pizza: ",
            Number(accInfor.pizza),
            ", hambuger: ",
            Number(accInfor.hambuger)
        );
    });

    it("Vote Hambuger!", async () => {
        await program.rpc.voteHambuger({
            accounts: {
                voteAcc: acc,
            },
        });
        const accInfor = await program.account.votingState.fetch(acc);
        console.log(
            "pizza: ",
            Number(accInfor.pizza),
            ", hambuger: ",
            Number(accInfor.hambuger)
        );
    });
});
