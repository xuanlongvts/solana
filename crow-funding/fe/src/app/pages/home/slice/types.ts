import { I_RESULT_ALL_CAMPAINS } from 'app/solana';

export const FIELD_CAMPAINS = 'campains';

export interface I_CAMPAINS {
    [FIELD_CAMPAINS]: Array<I_RESULT_ALL_CAMPAINS> | [];
}
