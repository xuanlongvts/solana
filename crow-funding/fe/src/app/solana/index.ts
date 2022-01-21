import Wallet from '@project-serum/sol-wallet-adapter';

import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    TransactionInstruction,
    TransactionSignature,
    AccountInfo,
} from '@solana/web3.js';
import { deserialize, serialize, Schema } from 'borsh';

import ENV, { ENUM_envName, getConfig } from '_config';
import { T_InforCampaiin } from '../comps/createCampain/consts';

const getUrl = getConfig(ENV ?? ENUM_envName.dev);
const wallet = new Wallet('https://www.sollet.io', getUrl);
const programId = new PublicKey('14B5EWiBbSDKpJUtD1sB7EL2yArW8eHdeFKFbpKq6tYE');
const connection = new Connection(getUrl, 'confirmed');

const setPayerAndBlockhashTransaction = async (instructions: TransactionInstruction[]): Promise<Transaction> => {
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

const signAndSendTransaction = async (transaction: Transaction): Promise<TransactionSignature> => {
    try {
        const signedTrans = await wallet.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signedTrans.serialize());
        return signature;
    } catch (err) {
        console.log('signAndSendTransaction error', err);
        throw err;
    }
};

interface I_CampaignDetails {
    admin: Buffer;
    name: string;
    description: string;
    image_link: string;
    amount_donated: number;
}

class CampaignDetails {
    admin = Buffer.alloc(32, 0);
    name = '';
    description = '';
    image_link = '';
    amount_donated = 0;

    constructor(props: I_CampaignDetails) {
        if (props) {
            this.admin = props.admin;
            this.name = props.name;
            this.description = props.description;
            this.image_link = props.image_link;
            this.amount_donated = props.amount_donated;
        }
    }

    static schema: Schema = new Map([
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

const checkWallet = async (): Promise<boolean> => {
    if (!wallet.connected) {
        await wallet.connect();
        return true;
    }
    return false;
};

export const CreateCampain = async ({ title, description, image_link }: T_InforCampaiin) => {
    const checkConn = await checkWallet();

    if (!checkConn && !wallet.publicKey) {
        return false;
    }
    const seedWords = `abcdef${Math.random().toString()}`;
    const newAccount = wallet.publicKey && (await PublicKey.createWithSeed(wallet.publicKey, seedWords, programId));

    const campaign =
        title &&
        description &&
        image_link &&
        wallet.publicKey &&
        new CampaignDetails({
            name: title,
            description,
            image_link,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            admin: wallet!.publicKey!.toBuffer(),
            amount_donated: 0,
        });

    const data: Uint8Array = serialize(CampaignDetails.schema, campaign);
    const dataSend = new Uint8Array([0, ...data]);
    const dataSendConvertToBuffer: Buffer = Buffer.from(dataSend);

    const lamports = await connection.getMinimumBalanceForRentExemption(data.length);

    const createProgramAccount =
        newAccount &&
        lamports &&
        SystemProgram.createAccountWithSeed({
            fromPubkey: wallet.publicKey,
            basePubkey: wallet.publicKey,
            seed: seedWords,
            newAccountPubkey: newAccount,
            lamports,
            space: data.length,
            programId,
        });

    const instructionToProgram =
        newAccount &&
        new TransactionInstruction({
            data: dataSendConvertToBuffer,
            programId,
            keys: [
                { pubkey: newAccount, isSigner: false, isWritable: true },
                { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
            ],
        });

    if (createProgramAccount && instructionToProgram) {
        const trans: Transaction = await setPayerAndBlockhashTransaction([createProgramAccount, instructionToProgram]);
        const signature = await signAndSendTransaction(trans);
        const result = await connection.confirmTransaction(signature);
        console.log('CreateCampain signature: ', signature);
        return result;
    }
};

type T_item_account = { pubkey: PublicKey; account: AccountInfo<Buffer> };
export interface I_RESULT_ALL_CAMPAINS extends I_CampaignDetails {
    pubId: PublicKey;
}

export const getAllCampaigns = async (): Promise<Array<I_RESULT_ALL_CAMPAINS>> => {
    const account = await connection.getProgramAccounts(programId);
    const campains: I_RESULT_ALL_CAMPAINS[] = [];
    account.forEach((item: T_item_account) => {
        try {
            const { name, description, image_link, amount_donated, admin } = deserialize(
                CampaignDetails.schema,
                CampaignDetails,
                item.account.data,
            );
            campains.push({
                pubId: item.pubkey,
                name,
                description,
                image_link,
                amount_donated,
                admin,
            });
        } catch (e) {
            console.log('getAllCampaigns: ===> ', e);
        }
    });
    return campains;
};