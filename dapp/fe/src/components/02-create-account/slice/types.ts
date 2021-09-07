export const ADDRESS_TO = 'address_to';
export const ACC_KEY_PAIR = 'account_keypair';
export const PROGRAM_ID = 'program_id';
export const KEY_ERR_MESS = 'errMess';

export const KEY_CPY = 'KEY_CPY';

export interface T_ACCOUNT {
    [ADDRESS_TO]?: string | null;
    [ACC_KEY_PAIR]?: string | null;
    [PROGRAM_ID]?: string | null;
    [KEY_ERR_MESS]?: string | null;
    [KEY_CPY]?: string | null;
}
