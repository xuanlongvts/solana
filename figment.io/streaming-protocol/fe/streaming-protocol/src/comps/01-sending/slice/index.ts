import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_SENDING } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';

import * as TYPES_T_I from './types';

import saga from './saga';

// const data_tmp = {
//     sending: [
//         {
//             amount_second: 66,
//             end_time: 1630889016,
//             sender: 'A7j3YAgaHmTdmCHPhLvVrwjzKTHM37GowfUTLsyowfBX',
//             pda_account: '3PoNu2xRQLLefNpHPTDGkAqigR5caAAPKNs3Kr1wNEdh',
//             lamports_withdrawn: 0,
//             start_time: 1630853012,
//             receiver: '7f71EW6o6bjzUQ5kminkZVcLYKA3RznJf6CgcL2yNEom',
//             total_amount: 2376264,
//         },
//     ],
//     receiving: [
//         {
//             amount_second: 66,
//             end_time: 1630889016,
//             sender: 'A7j3YAgaHmTdmCHPhLvVrwjzKTHM37GowfUTLsyowfBX',
//             pda_account: '3PoNu2xRQLLefNpHPTDGkAqigR5caAAPKNs3Kr1wNEdh',
//             lamports_withdrawn: 0,
//             start_time: 1630853012,
//             receiver: '7f71EW6o6bjzUQ5kminkZVcLYKA3RznJf6CgcL2yNEom',
//             total_amount: 2376264,
//         },
//     ],
// };

export const initialState: TYPES_T_I.I_SENDING = {
    [TYPES_T_I.FIELD_SENDING]: null,
    [TYPES_T_I.FIELD_PUBKEY_SUBMIT]: null,
    [TYPES_T_I.FIELD_ERR_MESS]: null,
    [TYPES_T_I.FIELD_CLOSE_STREAM]: null,
};
const { [TYPES_T_I.FIELD_ERR_MESS]: initErrMess, [TYPES_T_I.FIELD_SENDING]: initDataUser } = initialState;

const slice = createSlice({
    name: NSP_SENDING,
    initialState,
    reducers: {
        getAllStreamsCall(state, action: PayloadAction<TYPES_T_I.T_GET_ALL_STREAMS>) {
            const { pubkey } = action.payload;
            state[TYPES_T_I.FIELD_PUBKEY_SUBMIT] = pubkey;
        },
        getAllStreamsSuccess(state, action: PayloadAction<TYPES_T_I.T_GET_ALL_STREAMS_SUCCESS>) {
            const { result } = action.payload;

            state[TYPES_T_I.FIELD_ERR_MESS] = initErrMess;
            state[TYPES_T_I.FIELD_SENDING] = result;
        },
        getAllStreamsFailed(state, action: PayloadAction<string>) {
            state[TYPES_T_I.FIELD_ERR_MESS] = action.payload;
            state[TYPES_T_I.FIELD_SENDING] = initDataUser;
        },
        setCloseStreamSuccess(state) {
            state[TYPES_T_I.FIELD_CLOSE_STREAM] = true;
        },
        setCloseStreamFailed(state) {
            state[TYPES_T_I.FIELD_CLOSE_STREAM] = false;
        },
    },
});

export const { actions: SendingTypeActions, reducer } = slice;

export const useSendingTypeSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: slice.name, saga });
    return { actions: slice.actions };
};
