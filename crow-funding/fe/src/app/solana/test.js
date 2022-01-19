import Wallet from '@project-serum/sol-wallet-adapter';
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    TransactionInstruction,
    TransactionSignature,
} from '@solana/web3.js';
import { deserialize, serialize, Schema } from 'borsh';
import ENV, { ENUM_envName, getConfig } from '_config';

const getUrl = getConfig(ENV ?? ENUM_envName.dev);
const wallet = new Wallet('https://www.sollet.io', getUrl);
const programId = new PublicKey('14B5EWiBbSDKpJUtD1sB7EL2yArW8eHdeFKFbpKq6tYE');
const connection = new Connection(getUrl, 'confirmed');

const setPayerAndBlockhashTransaction = async instructions => {
    const transaction = new Transaction();
    instructions.forEach(ele => {
        transaction.add(ele);
    });
    if (wallet.publicKey) {
        transaction.feePayer = wallet.publicKey;
    }
    const hash = await connection.getRecentBlockhash();
    if (hash.blockhash) {
        transaction.recentBlockhash = hash.blockhash;
    }
    return transaction;
};

const signAndSendTransaction = async transaction => {
    try {
        const signedTrans = await wallet.signTransaction(transaction);
        console.log('signedTrans: ', signedTrans.serialize());
        const signature = await connection.sendRawTransaction(signedTrans.serialize());
        console.log('signature: ', signature);
        return signature;
    } catch (err) {
        console.log('signAndSendTransaction error', err);
        throw err;
    }
};

export class CampaignDetails {
    constructor(properties) {
        Object.keys(properties).forEach(key => {
            this[key] = properties[key];
        });
    }
    static schema = new Map([
        [
            CampaignDetails,
            {
                kind: 'struct',
                fields: [
                    ['admin', [32]],
                    ['name', 'string'],
                    ['description', 'string'],
                    ['image_link', 'string'],
                    ['amount_donated', 'u64'],
                ],
            },
        ],
    ]);
}

const checkWallet = async () => {
    if (!wallet.connected) {
        await wallet.connect();
        return true;
    }
    return false;
};

export async function CreateCampain({ title, description, image_link }) {
    await checkWallet();

    const SEED = 'abcdef' + Math.random().toString();
    let newAccount = await PublicKey.createWithSeed(wallet.publicKey, SEED, programId);

    let campaign = new CampaignDetails({
        name: title,
        description: description,
        image_link: image_link,
        admin: wallet.publicKey.toBuffer(),
        amount_donated: 0,
    });

    let data = serialize(CampaignDetails.schema, campaign);
    let data_to_send = new Uint8Array([0, ...data]);

    const lamports = await connection.getMinimumBalanceForRentExemption(data.length);

    const createProgramAccount = SystemProgram.createAccountWithSeed({
        fromPubkey: wallet.publicKey,
        basePubkey: wallet.publicKey,
        seed: SEED,
        newAccountPubkey: newAccount,
        lamports: lamports,
        space: data.length,
        programId: programId,
    });

    const instructionTOOurProgram = new TransactionInstruction({
        keys: [
            { pubkey: newAccount, isSigner: false, isWritable: true },
            { pubkey: wallet.publicKey, isSigner: true },
        ],
        programId: programId,
        data: data_to_send,
    });

    console.log('instructionTOOurProgram: ====>', instructionTOOurProgram);

    const trans = await setPayerAndBlockhashTransaction([createProgramAccount, instructionTOOurProgram]);
    console.log('trans: ', trans);
    const signature = await signAndSendTransaction(trans);
    console.log('signature: ', signature);
    const result = await connection.confirmTransaction(signature);
    console.log('end sendMessage', result);
}

// export const CreateCampain = async ({ title, description, image_link }) => {
//     const checkConn = await checkWallet();

//     if (!checkConn && !wallet.publicKey) {
//         return false;
//     }
//     const seedWords = `abcdef${Math.random.toString()}`;
//     const newAccount = wallet.publicKey && (await PublicKey.createWithSeed(wallet.publicKey, seedWords, programId));

//     const campaign =
//         title &&
//         description &&
//         image_link &&
//         wallet.publicKey &&
//         new CampaignDetails({
//             name: title,
//             description,
//             image_link,
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             admin: wallet.publicKey.toBuffer(),
//             amount_donated: 0,
//         });

//     const data = serialize(CampaignDetails.schema, campaign);
//     const dataSend = new Uint8Array([0, ...data]);

//     // const buf1 = Buffer.alloc(1, 0x0);
//     // const bufTmp: number[] = [];
//     // data.forEach(ele => {
//     //     bufTmp.push(ele);
//     // });
//     // const buf2 = Buffer.alloc(data.length, ...bufTmp);

//     // const totalLength = buf1.length + buf2.length;
//     // const bufTotal = Buffer.concat([buf1, buf2], totalLength);

//     // console.log('bufTotal: ', bufTotal);

//     // const buffInstructions = Buffer.from([0, ...tmpData]);
//     // console.log('buffInstructions: ===>', buffInstructions);

//     const lamports = await connection.getMinimumBalanceForRentExemption(data.length);

//     const createProgramAccount =
//         newAccount &&
//         lamports &&
//         SystemProgram.createAccountWithSeed({
//             fromPubkey: wallet.publicKey,
//             basePubkey: wallet.publicKey,
//             seed: seedWords,
//             newAccountPubkey: newAccount,
//             lamports,
//             space: data.length,
//             programId,
//         });

//     const instructionToProgram =
//         newAccount &&
//         new TransactionInstruction({
//             data: dataSend,
//             programId,
//             keys: [{ isSigner: false, isWritable: true, pubkey: newAccount }],
//         });

//     console.log('instructionToProgram: ====>', instructionToProgram);

//     if (createProgramAccount && instructionToProgram) {
//         const trans = await setPayerAndBlockhashTransaction([createProgramAccount, instructionToProgram]);
//         console.log('trans: ', trans);
//         const signature = await signAndSendTransaction(trans);
//         console.log('signature: ', signature);
//         // const result = await connection.confirmTransaction(signature);
//         // console.log('CreateCampain signature: ', signature);
//         // return result;
//     }
// };
