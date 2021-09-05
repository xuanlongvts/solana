import * as Yup from 'yup';

import { ENUM_FIELDS } from './const';

const min_lamports = 1;
const max_lamports = 1000000000000000; // 1000_000_000_000_000

const add_account = 44;
const FundAccSchema = Yup.object().shape({
    [ENUM_FIELDS.address_account]: Yup.string().length(add_account, 'Address account is 42 characters'),
    [ENUM_FIELDS.number_lamports]: Yup.number()
        .min(min_lamports, `Lamports min ${min_lamports}`)
        .max(max_lamports, `Lamports max ${max_lamports}`)
        .required('Lamports required'),
});

export default FundAccSchema;
