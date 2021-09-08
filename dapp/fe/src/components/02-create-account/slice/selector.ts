import { createSelector } from '@reduxjs/toolkit';

import { NSP_ACCOUNT, RootState } from '_types/root_state_type';
import { initialState } from '.';
import { ADDRESS_TO, SECRET_KEY, KEY_ERR_MESS, KEY_CPY, PROGRAM_ID, GREETER_CODE } from './types';

const selectAccount = (state: RootState) => state[NSP_ACCOUNT] || initialState;

export const selectAddress = createSelector([selectAccount], i => i[ADDRESS_TO]);
export const selectAccount_secret_key = createSelector([selectAccount], i => i[SECRET_KEY]);
export const selectProgram_id = createSelector([selectAccount], i => i[PROGRAM_ID]);
export const selectGreeter_code = createSelector([selectAccount], i => i[GREETER_CODE]);
export const selectAccoun_cpy = createSelector([selectAccount], i => i[KEY_CPY]);

export const selectErrorMess = createSelector([selectAccount], i => i[KEY_ERR_MESS]);
