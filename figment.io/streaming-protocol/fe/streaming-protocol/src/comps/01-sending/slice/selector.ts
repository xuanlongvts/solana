import { funcSelectComm } from '_utils/seletorComm';
import { NSP_SENDING, RootState } from '_types/root_state_type';

import { initialState } from '.';
import { FIELD_SENDING, FIELD_PUBKEY_SUBMIT } from './types';

const chooseDataSending = (state: RootState) => state[NSP_SENDING] || initialState;

export const selectDataSending = funcSelectComm(chooseDataSending, FIELD_SENDING);

export const selectPubkey = funcSelectComm(chooseDataSending, FIELD_PUBKEY_SUBMIT);
