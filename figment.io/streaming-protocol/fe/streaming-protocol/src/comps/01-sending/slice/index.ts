import { PayloadAction } from '@reduxjs/toolkit';

import { NSP_SENDING } from '_types/root_state_type';
import { createSlice, useInjectReducer, useInjectSaga } from '_redux';

import { FIELD_SENDING, I_SENDING } from './types';
import saga from './saga';

export const initialState: I_SENDING = {
    [FIELD_SENDING]: null,
};

const slice = createSlice({
    name: NSP_SENDING,
    initialState,
    reducers: {
        setAllCampaigns(state, action: PayloadAction<I_SENDING>) {
            const { [FIELD_SENDING]: data } = action.payload;
            state[FIELD_SENDING] = data;
        },
    },
});

export const { actions: SendingTypeActions, reducer } = slice;

export const useSendingTypeSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    useInjectSaga({ key: FIELD_SENDING, saga });
    return { actions: slice.actions };
};
