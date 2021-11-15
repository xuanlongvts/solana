/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-console */
import Wallet from '@project-serum/sol-wallet-adapter';
import { Connection, Transaction, PublicKey, TransactionInstruction } from '@solana/web3.js';
import EventEmitter from 'eventemitter3';

export interface WalletAdapter extends EventEmitter {
    publicKey: PublicKey | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    connect: () => any;
    disconnect: () => any;
}

const cluster = process.env.SOLANA_CLUSTER || 'http://api.devnet.solana.com';
const address_wallet = process.env.SOLANA_ADDRESS_WALLET || 'https://www.sollet.io';

const connect = new Connection(cluster, 'confirmed');
const wallet: WalletAdapter = new Wallet(address_wallet, cluster);

export const initWallet = async (): Promise<[Connection, WalletAdapter]> => {
    await wallet.connect();
    console.log('wallet publicKey: ', wallet?.publicKey?.toBase58());
    return [connect, wallet];
};

export const setWalletTransaction = async (instruction: TransactionInstruction): Promise<Transaction> => {
    const trans = new Transaction();
    trans.add(instruction);
    trans.feePayer = wallet!.publicKey!;
    const hash = await connect.getRecentBlockhash();
    trans.recentBlockhash = hash.blockhash;

    return trans;
};

export const signAndSendTransaction = async (wallet: WalletAdapter, trans: Transaction): Promise<string> => {
    const signedTrans = await wallet.signTransaction(trans);
    const signature = await connect.sendRawTransaction(signedTrans.serialize());
    return signature;
};
