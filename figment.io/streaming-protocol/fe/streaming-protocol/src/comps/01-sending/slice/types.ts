export const FIELD_SENDING = 'data_sending';

type T_ITEM = {
    amount_second: number;
    end_time: number;
    sender: string;
    pda_account: string;
    lamports_withdrawn: number;
    start_time: number;
    receiver: string;
    total_amount: number;
};

type DATA_SENDING = {
    sending: Array<T_ITEM>;
    receiving: Array<T_ITEM>;
};

export interface I_SENDING {
    [FIELD_SENDING]: DATA_SENDING | null;
}
