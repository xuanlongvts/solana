export const ADDRESS_TO = 'address_to';
export const ACC_KEY_PAIR = 'account_keypair';
export const KEY_ERR_MESS = 'errMess';

export const KEY_CPY = 'KEY_CPY';

export interface T_ACCOUNT {
    [ADDRESS_TO]?: string | null;
    [ACC_KEY_PAIR]?: string | null;
    [KEY_ERR_MESS]?: string | null;
    [KEY_CPY]?: string | null;
}
