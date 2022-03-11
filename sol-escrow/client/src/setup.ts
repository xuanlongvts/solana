import {
    LAMPORTS_PER_SOL,
    Connection,
    Signer,
    PublicKey,
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    createMint,
    createAccount,
    mintTo,
} from "@solana/spl-token";

import { connection } from "./const";
import {
    getKeypair,
    getPublickey,
    getTokenBalance,
    writePublicKey,
} from "./utils";

const createMintToken = async ({
    publicKey,
    secretKey,
}: Signer): Promise<PublicKey> => {
    return createMint(
        connection,
        { publicKey, secretKey },
        publicKey,
        null,
        0,
        undefined,
        undefined,
        TOKEN_PROGRAM_ID
    );
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
        alicePublicKey,
        alicePublicKey
    );
    writePublicKey(aliceTokenAccount, `alice_${name.toLowerCase()}`);

    console.log(`Creating Bob TokenAccount for ${name}...`);
    const bobTokenAccount = await createAccount(
        connection,
        clientKeypair,
        bobPublicKey,
        bobPublicKey
    );
    writePublicKey(bobTokenAccount, `bob_${name.toLowerCase()}`);

    return [mintPubkey, aliceTokenAccount, bobTokenAccount];
};

const setup = async () => {
    const alicePublickey = getPublickey("alice");
    const bobPublickey = getPublickey("bob");
    const clientKeypair = getKeypair("id");

    console.log("Requesting SOL for alice ...");
    await connection.requestAirdrop(alicePublickey, LAMPORTS_PER_SOL * 10);

    console.log("Requesting SOL for bob ...");
    await connection.requestAirdrop(bobPublickey, LAMPORTS_PER_SOL * 10);

    console.log("Requesting SOL for client ...");
    await connection.requestAirdrop(
        clientKeypair.publicKey,
        LAMPORTS_PER_SOL * 10
    );

    const [mintX, aliceTokenAccountForX, bobTokenAccountForX] = await setupMint(
        "X",
        alicePublickey,
        bobPublickey,
        clientKeypair
    );
    console.log("Sending 50X to Alice's X TokenAccount...");
    await mintTo(
        connection,
        clientKeypair,
        alicePublickey,
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
    console.log("Sending 50Y to Bob's Y TokenAccount...");
    await mintTo(
        connection,
        clientKeypair,
        bobPublickey,
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
    console.log("");
};

setup();
