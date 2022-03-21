import { LAMPORTS_PER_SOL, Signer, PublicKey } from "@solana/web3.js";
import { createMint, createAccount, mintTo } from "@solana/spl-token";

import {
    connection,
    establishConnection,
    ACC_PATH,
    createKeypairFromFile,
} from "./const";
import { getPublickey, getTokenBalance, writePublicKey } from "./utils";

const createMintToken = async (payer: Signer): Promise<PublicKey> => {
    // Create new token mint
    try {
        // Create new token mint
        const mint = await createMint(
            connection,
            payer,
            payer.publicKey,
            null,
            9
        );
        // console.log("mint: ===> ", mint);
        return mint;
    } catch (err) {
        console.log("createMintToken: ===> ", err);
        return process.exit(1);
    }
};

const setupMint = async (
    name: string,
    alicePublicKey: PublicKey,
    bobPublicKey: PublicKey,
    clientKeypair: Signer
): Promise<[PublicKey, PublicKey, PublicKey]> => {
    console.log(`Creating mint ${name}...`);
    const mintPubkey = await createMintToken(clientKeypair);
    writePublicKey(mintPubkey, `mint_${name.toLowerCase()}`);

    console.log(`Creating Alice TokenAccount for ${name}...`);
    const aliceTokenAccount = await createAccount(
        connection,
        clientKeypair,
        mintPubkey,
        alicePublicKey
    );
    writePublicKey(aliceTokenAccount, `alice_${name.toLowerCase()}`);

    console.log(`Creating Bob TokenAccount for ${name}...`);
    const bobTokenAccount = await createAccount(
        connection,
        clientKeypair,
        mintPubkey,
        bobPublicKey
    );
    writePublicKey(bobTokenAccount, `bob_${name.toLowerCase()}`);

    return [mintPubkey, aliceTokenAccount, bobTokenAccount];
};

const setup = async () => {
    await establishConnection();

    const alicePublickey = getPublickey("alice");
    const bobPublickey = getPublickey("bob");
    const clientKeypair = await createKeypairFromFile(ACC_PATH("id"));

    // console.log("Requesting SOL for alice ...");
    const airdropSignatureAlice = await connection.requestAirdrop(
        alicePublickey,
        LAMPORTS_PER_SOL * 2
    );
    await connection.confirmTransaction(airdropSignatureAlice);

    // console.log("Requesting SOL for bob ...");
    const airdropSignatureBob = await connection.requestAirdrop(
        bobPublickey,
        LAMPORTS_PER_SOL * 2
    );
    await connection.confirmTransaction(airdropSignatureBob);

    // console.log("Requesting SOL for client ...");
    const airdropSignatureClient = await connection.requestAirdrop(
        clientKeypair.publicKey,
        LAMPORTS_PER_SOL * 2
    );
    await connection.confirmTransaction(airdropSignatureClient);

    const [mintX, aliceTokenAccountForX, bobTokenAccountForX] = await setupMint(
        "X",
        alicePublickey,
        bobPublickey,
        clientKeypair
    );
    // console.log("Sending 50X to Alice's X TokenAccount...");
    await mintTo(
        connection,
        clientKeypair,
        mintX,
        aliceTokenAccountForX,
        clientKeypair.publicKey,
        50
    );

    const [mintY, aliceTokenAccountForY, bobTokenAccountForY] = await setupMint(
        "Y",
        alicePublickey,
        bobPublickey,
        clientKeypair
    );
    // console.log("Sending 50Y to Bob's Y TokenAccount...");
    await mintTo(
        connection,
        clientKeypair,
        mintY,
        bobTokenAccountForY,
        clientKeypair.publicKey,
        50
    );

    console.log("✨Setup complete✨\n");
    console.table([
        {
            "Alice Token Account X": await getTokenBalance(
                aliceTokenAccountForX,
                connection
            ),
            "Alice Token Account Y": await getTokenBalance(
                aliceTokenAccountForY,
                connection
            ),
            "Bob Token Account X": await getTokenBalance(
                bobTokenAccountForX,
                connection
            ),
            "Bob Token Account Y": await getTokenBalance(
                bobTokenAccountForY,
                connection
            ),
        },
    ]);
    /*
    ┌─────────┬───────────────────────┬───────────────────────┬─────────────────────┬─────────────────────┐
    │ (index) │ Alice Token Account X │ Alice Token Account Y │ Bob Token Account X │ Bob Token Account Y │
    ├─────────┼───────────────────────┼───────────────────────┼─────────────────────┼─────────────────────┤
    │    0    │          50           │           0           │          0          │         50          │
    └─────────┴───────────────────────┴───────────────────────┴─────────────────────┴─────────────────────┘
    */
};

setup();
