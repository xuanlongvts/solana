import { PublicKey } from '@solana/web3.js';

export const FIELD_SENDING = 'data_sending';
export const FIELD_PUBKEY_SUBMIT = 'pubkey_submit';
export const FIELD_ERR_MESS = 'errMess';

export const FIELD_CLOSE_STREAM = 'close_stream';

export type T_ITEM = {
    amount_second: number;
    end_time: number;
    sender: string;
    pda_account: PublicKey;
    lamports_withdrawn: number;
    start_time: number;
    receiver: PublicKey;
    total_amount: number;
};

interface DATA_SENDING {
    sending: Array<T_ITEM>;
    receiving: Array<T_ITEM>;
}

export interface I_SENDING {
    [FIELD_PUBKEY_SUBMIT]: string | null;
    [FIELD_ERR_MESS]: string | null;
    [FIELD_SENDING]: DATA_SENDING | null;
    [FIELD_CLOSE_STREAM]: boolean | null;
}

export type T_GET_ALL_STREAMS = {
    pubkey: string;
};

export type T_GET_ALL_STREAMS_SUCCESS = {
    result: DATA_SENDING;
};
