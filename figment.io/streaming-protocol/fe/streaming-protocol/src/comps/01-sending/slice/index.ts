import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_SENDING } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';

import {
    FIELD_SENDING,
    FIELD_PUBKEY_SUBMIT,
    I_SENDING,
    T_GET_ALL_STREAMS,
    FIELD_ERR_MESS,
    T_GET_ALL_STREAMS_SUCCESS,
} from './types';
import saga from './saga';

const data_tmp = {
    sending: [
        {
            amount_second: 66,
            end_time: 1630889016,
            sender: 'A7j3YAgaHmTdmCHPhLvVrwjzKTHM37GowfUTLsyowfBX',
            pda_account: '3PoNu2xRQLLefNpHPTDGkAqigR5caAAPKNs3Kr1wNEdh',
            lamports_withdrawn: 0,
            start_time: 1630853012,
            receiver: '7f71EW6o6bjzUQ5kminkZVcLYKA3RznJf6CgcL2yNEom',
            total_amount: 2376264,
        },
    ],
    receiving: [
        {
            amount_second: 66,
            end_time: 1630889016,
            sender: 'A7j3YAgaHmTdmCHPhLvVrwjzKTHM37GowfUTLsyowfBX',
            pda_account: '3PoNu2xRQLLefNpHPTDGkAqigR5caAAPKNs3Kr1wNEdh',
            lamports_withdrawn: 0,
            start_time: 1630853012,
            receiver: '7f71EW6o6bjzUQ5kminkZVcLYKA3RznJf6CgcL2yNEom',
            total_amount: 2376264,
        },
    ],
};

export const initialState: I_SENDING = {
    [FIELD_SENDING]: data_tmp,
    [FIELD_PUBKEY_SUBMIT]: null,
    [FIELD_ERR_MESS]: null,
};
const { [FIELD_ERR_MESS]: initErrMess, [FIELD_SENDING]: initDataUser } = initialState;

const slice = createSlice({
    name: NSP_SENDING,
    initialState,
    reducers: {
        getAllStreamsCall(state, action: PayloadAction<T_GET_ALL_STREAMS>) {
            const { pubkey } = action.payload;
            state[FIELD_PUBKEY_SUBMIT] = pubkey;
        },
        getAllStreamsSuccess(state, action: PayloadAction<T_GET_ALL_STREAMS_SUCCESS>) {
            const { result } = action.payload;

            state[FIELD_ERR_MESS] = initErrMess;
            state[FIELD_SENDING] = result;
        },
        getAllStreamsFailed(state, action: PayloadAction<string>) {
            state[FIELD_ERR_MESS] = action.payload;
            state[FIELD_SENDING] = initDataUser;
        },
    },
});

export const { actions: SendingTypeActions, reducer } = slice;

export const useSendingTypeSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: FIELD_SENDING, saga });
    return { actions: slice.actions };
};
