export enum ENUM_FIELDS {
    address_account = 'address_account',
    number_lamports = 'number_lamports',
}

export interface T_HOOKS_FOMR {
    [ENUM_FIELDS.address_account]: string;
    [ENUM_FIELDS.number_lamports]: string;
}
