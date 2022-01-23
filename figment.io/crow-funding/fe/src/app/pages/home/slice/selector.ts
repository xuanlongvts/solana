import { funcSelectComm } from 'app/_utils/seletorComm';
import { NSP_ALL_CAMPAINS, RootState } from '_types/root_state_type';
import { initialState } from '.';
import { FIELD_CAMPAINS } from './types';

const chooseCampains = (state: RootState) => state[NSP_ALL_CAMPAINS] || initialState;

export const selectCampains = funcSelectComm(chooseCampains, FIELD_CAMPAINS);
