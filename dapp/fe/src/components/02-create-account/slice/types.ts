export const ADDRESS_TO = 'address_to';
export const SECRET_KEY = 'secret_key';
export const PROGRAM_ID = 'program_id';
export const GREETER_CODE = 'greeter_code';
export const KEY_ERR_MESS = 'errMess';

export const KEY_CPY = 'KEY_CPY';

export interface T_ACCOUNT {
    [ADDRESS_TO]?: string | null;
    [SECRET_KEY]?: string | null;
    [PROGRAM_ID]?: string | null;
    [GREETER_CODE]?: string | null;
    [KEY_ERR_MESS]?: string | null;
    [KEY_CPY]?: string | null;
}
