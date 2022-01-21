import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_ALL_CAMPAINS } from '_types/root_state_type';
import { createSlice, useInjectReducer } from 'app/_redux';
import { I_RESULT_ALL_CAMPAINS } from 'app/solana';
import * as TYPES_KEYS from './types';

export const initialState: TYPES_KEYS.I_CAMPAINS = {
    [TYPES_KEYS.FIELD_CAMPAINS]: [],
};

const slice = createSlice({
    name: NSP_ALL_CAMPAINS,
    initialState,
    reducers: {
        setAllCampaigns(state, action: PayloadAction<Array<I_RESULT_ALL_CAMPAINS>>) {
            state[TYPES_KEYS.FIELD_CAMPAINS] = action.payload;
        },
    },
});

export const { actions: campainsTypeActions, reducer } = slice;

export const useCampainsTypeSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};
