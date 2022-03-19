import { Connection, Keypair, PublicKey } from "@solana/web3.js";
// import * as fs from "fs";
import fs from "mz/fs";

const Buffer = require("@solana/buffer-layout");

import { NAME_FOLDER } from "./const";

export interface EscrowLayout {
    isInitialized: number;
    initializerPubkey: Uint8Array;
    initializerReceivingTokenAccountPubkey: Uint8Array;
    initializerTempTokenAccountPubkey: Uint8Array;
    expectedAmount: Uint8Array;
}

const pathFilePub = (name: string): string =>
    `./${NAME_FOLDER}/${name}_pub.json`;

const transformString = (name: string) =>
    fs.readFileSync(pathFilePub(name)) as unknown as string;

export const writePublicKey = (publickey: PublicKey, name: string) => {
    fs.writeFileSync(pathFilePub(name), JSON.stringify(publickey.toString()));
};

export const getPublickey = (name: string): PublicKey => {
    return new PublicKey(JSON.parse(transformString(name)));
};

export const getPrivateKey = (name: string): Uint8Array => {
    const pathFile = fs.readFileSync(
        `./${NAME_FOLDER}/${name}.json`
    ) as unknown as string;
    return Uint8Array.from(JSON.parse(pathFile));
};

export const getKeypair = (name: string): Keypair => {
    return new Keypair({
        publicKey: getPublickey(name).toBytes(),
        secretKey: getPrivateKey(name),
    });
};

export const getProgramId = () => {
    try {
        return getPublickey("program");
    } catch (err) {
        console.log("getProgramId: ===> ", err);
        console.log("Given programId is missing or incorrect");
        process.exit(1);
    }
};

type T_terms = {
    aliceExpectedAmount: number;
    bobExpectedAmount: number;
};
export const getTerms = (): T_terms => {
    return JSON.parse(fs.readFileSync("./terms.json") as unknown as string);
};

export const getTokenBalance = async (
    pubkey: PublicKey,
    connection: Connection
): Promise<number> => {
    const getAmounts = (await connection.getTokenAccountBalance(pubkey)).value
        .amount;
    return parseInt(getAmounts);
};

const publicKey = (property = "publicKey") => {
    return Buffer.blob(32, property);
}; // Blob { span: 32, property: 'publicKey', length: 32 }

const uint64 = (property = "uint64") => {
    return Buffer.blob(8, property);
}; // Blob { span: 8, property: 'uint64', length: 8 }

export const ESCROW_ACCOUNT_DATA_LAYOUT = Buffer.struct([
    Buffer.u8("isInitialized"),
    publicKey("initializerPubkey"),
    publicKey("initializerTempTokenAccountPubkey"),
    publicKey("initializerReceivingTokenAccountPubkey"),
    uint64("expectedAmount"),
]);
/*
Structure {
	span: 105,
	property: undefined,
	fields: [
		UInt { span: 1, property: 'isInitialized' },
		Blob { span: 32, property: 'initializerPubkey', length: 32 },
		Blob {
			span: 32,
			property: 'initializerTempTokenAccountPubkey',
			length: 32
		},
		Blob {
			span: 32,
			property: 'initializerReceivingTokenAccountPubkey',
			length: 32
		},
		Blob { span: 8, property: 'expectedAmount', length: 8 }
	],
	decodePrefixes: false
}
*/
