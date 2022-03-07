import {
    Keypair,
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "mz/fs";
import path from "path";
import * as borsh from "borsh";

import { getRpcUrl, getPayer, createKeypairFromFile } from "./utils";

let connection: Connection;
let payer: Keypair;
let programId: PublicKey;
let greetedPubkey: PublicKey;

// Path to program files
const NAME_SO_FILE = "hi_world.so";
const PROGRAM_PATH = path.resolve(__dirname, "../../hi_world/dist");
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, NAME_SO_FILE);
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, "hi_world-keypair.json");

type T_GreetingAccount = {
    counter: number;
};
class GreetingAccount {
    counter: number = 0;
    constructor(fields: T_GreetingAccount | undefined = undefined) {
        if (fields) {
            this.counter = fields.counter;
        }
    }
}

const GreetingSchema = new Map([
    [
        GreetingAccount,
        {
            kind: "struct",
            fields: [["counter", "u32"]],
        },
    ],
]);

const GREETING_SIZE = borsh.serialize(
    GreetingSchema,
    new GreetingAccount()
).length;

// Establish a connection to the cluster
export const establishConnection = async (): Promise<void> => {
    const rpcUrl = await getRpcUrl();
    connection = new Connection(rpcUrl, "confirmed");
    const version = await connection.getVersion();
    console.log("Connection to cluster established:", rpcUrl, version);
};

// Establish an account to pay for everything
export const establishPayer = async (): Promise<void> => {
    let fees = 0;
    if (!payer) {
        const { lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Calculate the cost of sending transactions
        fees += await connection.getMinimumBalanceForRentExemption(
            GREETING_SIZE
        );

        // Calculate the cost of sending transactions
        fees += lastValidBlockHeight * 100; // wag

        payer = await getPayer();
    }

    let lamports = await connection.getBalance(payer.publicKey);
    if (lamports < fees) {
        // If current balance is not enough to pay for fees, request an airdrop
        const sig = await connection.requestAirdrop(
            payer.publicKey,
            fees - lamports
        );
        await connection.confirmTransaction(sig);
        lamports = await connection.getBalance(payer.publicKey);
    }
    console.log(
        "Using account",
        payer.publicKey.toBase58(),
        "containing",
        lamports / LAMPORTS_PER_SOL,
        "SOL to pay for fees"
    );
};

// Check if the hello world BPF program has been deployed
export const checkProgram = async (): Promise<void> => {
    // Read program id from keypair file
    try {
        const programKeypair = await createKeypairFromFile(
            PROGRAM_KEYPAIR_PATH
        );
        programId = programKeypair.publicKey;
    } catch (err) {
        const errMsg = (err as Error).message;
        throw new Error(
            `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/${NAME_SO_FILE}\``
        );
    }

    // Check if the program has been deployed
    const programInfo = await connection.getAccountInfo(programId);
    if (!programInfo) {
        if (fs.existsSync(PROGRAM_SO_PATH)) {
            throw new Error(
                `Program needs to be deployed with \`solana program deploy dist/${NAME_SO_FILE}\``
            );
        } else {
            throw new Error("Program needs to be built and deployed");
        }
    } else if (!programInfo.executable) {
        throw new Error("Program is not executable");
    }
    console.log(`Using program ${programId.toBase58()}`); // get success Program Id when deploy hi_world.so file

    const GREETING_SEED = "hello";
    greetedPubkey = await PublicKey.createWithSeed(
        payer.publicKey,
        GREETING_SEED,
        programId
    );

    // Check if the greeting account has already been created
    const greetedAccount = await connection.getAccountInfo(greetedPubkey);
    if (!greetedAccount) {
        console.log(
            "Creating account",
            greetedPubkey.toBase58(),
            "to say hello to"
        );

        let lamports = await connection.getMinimumBalanceForRentExemption(
            GREETING_SIZE
        );

        const transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: payer.publicKey,
                newAccountPubkey: greetedPubkey,
                basePubkey: payer.publicKey,
                seed: GREETING_SEED,
                lamports,
                space: GREETING_SIZE,
                programId,
            })
        );
        sendAndConfirmTransaction(connection, transaction, [payer]);
    }
};

// Say hello
export const sayHello = async (): Promise<void> => {
    console.log("Saying Hello to ", greetedPubkey.toBase58());
    const instruction = new TransactionInstruction({
        keys: [
            {
                pubkey: greetedPubkey,
                isSigner: false,
                isWritable: true,
            },
        ],
        programId,
        data: Buffer.alloc(0),
    });
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instruction),
        [payer]
    );
};

// Report the number of times the greeted account has been said hello to
export const reportGreetings = async (): Promise<void> => {
    const accountInfo = await connection.getAccountInfo(greetedPubkey);
    if (!accountInfo) {
        throw "Error: cannot find the greeted account";
    }
    const greeting = borsh.deserialize(
        GreetingSchema,
        GreetingAccount,
        accountInfo.data
    );
    console.log(
        greetedPubkey.toBase58(),
        "has been greeted ",
        greeting.counter,
        " time(s)"
    );
};
