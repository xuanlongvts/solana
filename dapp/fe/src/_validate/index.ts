import * as Yup from 'yup';

export enum ENUM_FIELDS {
    program_id = 'program_id',
    address_account = 'address_account',
    number_lamports = 'number_lamports',
}

export interface T_HOOKS_FOMR_SEND_LAMPORTS {
    [ENUM_FIELDS.address_account]: string;
    [ENUM_FIELDS.number_lamports]: string;
}

const min_lamports = 1;
const max_lamports = 1000000000000000; // 1000_000_000_000_000

const add_account = 44;

export const add_acc = Yup.string().length(add_account, `Address account is ${add_account} characters`);

export const program_id = Yup.string().length(add_account, `Program Id is ${add_account} characters`);

export const lamports = Yup.number()
    .min(min_lamports, `Lamports min ${min_lamports}`)
    .max(max_lamports, `Lamports max ${max_lamports}`)
    .required('Lamports required');

const FundAccSchema = Yup.object().shape({
    [ENUM_FIELDS.address_account]: add_acc,
    [ENUM_FIELDS.number_lamports]: lamports,
});

export default FundAccSchema;
