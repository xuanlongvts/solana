import { LocalStorageServices, LocalStorageKey } from '_utils/localStorage';
import { NSP_ACCOUNT } from '_types/root_state_type';
import { createSlice, useInjectReducer } from '_redux';
import { PayloadAction } from '@reduxjs/toolkit';

import * as TYPES_KEYS from './types';

export const initialState: TYPES_KEYS.T_ACCOUNT = {
    [TYPES_KEYS.ADDRESS_TO]: LocalStorageServices.getItem(LocalStorageKey().address_to),
    [TYPES_KEYS.SECRET_KEY]: LocalStorageServices.getItem(LocalStorageKey().secret_key),
    [TYPES_KEYS.PROGRAM_ID]: LocalStorageServices.getItem(LocalStorageKey().program_id),
    [TYPES_KEYS.GREETER_CODE]: LocalStorageServices.getItem(LocalStorageKey().greeter_code),
    [TYPES_KEYS.KEY_ERR_MESS]: null,
    [TYPES_KEYS.KEY_CPY]: null,
};

const slice = createSlice({
    name: NSP_ACCOUNT,
    initialState,
    reducers: {
        setAccount(state, action: PayloadAction<TYPES_KEYS.T_ACCOUNT>) {
            const { address_to, secret_key } = action.payload;

            state[TYPES_KEYS.ADDRESS_TO] = address_to;
            state[TYPES_KEYS.SECRET_KEY] = secret_key;

            state[TYPES_KEYS.KEY_ERR_MESS] = null;
            LocalStorageServices.setItem(LocalStorageKey().address_to, address_to);
            LocalStorageServices.setItem(LocalStorageKey().secret_key, secret_key);
        },
        setProgramId(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.PROGRAM_ID] = action.payload;
            LocalStorageServices.setItem(LocalStorageKey().program_id, action.payload);
        },
        setGreeterCode(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.GREETER_CODE] = action.payload;
            LocalStorageServices.setItem(LocalStorageKey().greeter_code, action.payload);
        },
        setCpy(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_CPY] = action.payload;
        },
        setClearCpy(state) {
            state[TYPES_KEYS.KEY_CPY] = null;
        },
        setErrorMess(state, action: PayloadAction<string>) {
            state[TYPES_KEYS.KEY_ERR_MESS] = action.payload;
        },
    },
});

export const { actions: accountKeypairActions, reducer } = slice;

const AccountSlice = () => {
    useInjectReducer({ key: slice.name, reducer: slice.reducer });
    return { actions: slice.actions };
};

export default AccountSlice;
