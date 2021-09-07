import { createSelector } from '@reduxjs/toolkit';

import { NSP_ACCOUNT, RootState } from '_types/root_state_type';
import { initialState } from '.';
import { ADDRESS_TO, ACC_KEY_PAIR, KEY_ERR_MESS, KEY_CPY, PROGRAM_ID } from './types';

const selectAccount = (state: RootState) => state[NSP_ACCOUNT] || initialState;

export const selectAddress = createSelector([selectAccount], i => i[ADDRESS_TO]);
export const selectAccount_Keypair = createSelector([selectAccount], i => i[ACC_KEY_PAIR]);
export const selectProgram_id = createSelector([selectAccount], i => i[PROGRAM_ID]);
export const selectAccoun_cpy = createSelector([selectAccount], i => i[KEY_CPY]);

export const selectErrorMess = createSelector([selectAccount], i => i[KEY_ERR_MESS]);
