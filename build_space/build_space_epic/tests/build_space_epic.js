const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
    console.log("Starting test...");

    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.BuildSpaceEpic;
    /*
    Note: Naming + folder structure is mega important here. 
    Ex. Anchor knows to look at programs/myepicproject/src/lib.rs b/c we used anchor.workspace.Myepicproject.
    */
    let baseAccount = anchor.web3.Keypair.generate();

    const tx = await program.rpc.startStuffOff({
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
    });
    console.log("📝 Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
    );
    console.log("GIF Count 1:", account.totalGifs.toString());

    await program.rpc.addGif("insert_a_giphy_link_here", {
        accounts: {
            baseAccount: baseAccount.publicKey,
        },
    });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("GIF Count 2:", account.totalGifs.toString());

    await program.rpc.updateVotes("insert_a_giphy_link_here", "pass_1_pubkey", {
        accounts: {
            baseAccount: baseAccount.publicKey,
        },
    });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    await program.rpc.updateVotes("insert_a_giphy_link_here", "pass_2_pubkey", {
        accounts: {
            baseAccount: baseAccount.publicKey,
        },
    });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    console.log("GIF List: ", account.gifList);
    console.log("pubkey: ", account.gifList[0].votes.pubkeys);
    console.log("likes: ", account.gifList[0].votes.likes);

    await program.rpc.updateVotes("insert_a_giphy_link_here", "pass_2_pubkey", {
        accounts: {
            baseAccount: baseAccount.publicKey,
        },
    });
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("GIF List: ", account.gifList);
    console.log("pubkey: ", account.gifList[0].votes.pubkeys);
    console.log("likes: ", account.gifList[0].votes.likes);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (err) {
        console.error(err);

        process.exit(1);
    }
};

runMain();
