import {
    clusterApiUrl,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    createAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

(async () => {
    // Connect to cluster
    const conn = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Generate a new wallet keypair and airdrop SOL
    const fromWallet = Keypair.generate();

    const fromAirdropSignature = await conn.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL * 2
    ); // NOTE NOTE NOTE: Devnet, Testnet not allow airdrop > 2 SOL at this moment (12/3/2022)

    // Wait for airdrop confirmation
    await conn.confirmTransaction(fromAirdropSignature);

    // Generate a new wallet to receive newly minted token
    const toWallet = Keypair.generate();

    // Create new token mint
    const mint = await createMint(
        conn,
        fromWallet,
        fromWallet.publicKey,
        null,
        1
    );
    console.log("mint: ", mint);

    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        conn,
        fromWallet,
        mint,
        fromWallet.publicKey
    );

    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        conn,
        fromWallet,
        mint,
        toWallet.publicKey
    );

    // Mint 1 new token to the "fromTokenAccount" account we just created
    let signature = await mintTo(
        conn,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        LAMPORTS_PER_SOL,
        []
    );
    console.log("mint tx", signature);

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await transfer(
        conn,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        LAMPORTS_PER_SOL,
        []
    );
    console.log("transfer tx:", signature);

    const acc_new = await createAccount(
        conn,
        fromWallet,
        mint,
        fromWallet.publicKey
    );
    console.log("acc_new: ===> ", acc_new);
})();

// run at command line ===>  ts-node src/test_lib/spl_token.ts
