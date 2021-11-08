const anchor = require("@project-serum/anchor");

const main = async () => {
    console.log("Starting test...");

    anchor.setProvider(anchor.Provider.env());

    const program = anchor.workspace.BuildSpaceEpic;

    /*
    Note: Naming + folder structure is mega important here. 
    Ex. Anchor knows to look at programs/myepicproject/src/lib.rs b/c we used anchor.workspace.Myepicproject.
    */

    const tx = await program.rpc.startStuffOff();

    console.log("📝 Your transaction signature", tx);
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
