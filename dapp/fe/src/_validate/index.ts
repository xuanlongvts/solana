/* eslint-disable no-restricted-globals */
import * as Yup from 'yup';
import { toNumber, isNull } from 'lodash';

import { dateToUnix } from '_utils/datetime';
import { FIELD_VALIDATION_TYPE } from '_consts';

import {
    msgRequired,
    msgNumberPositive,
    msgNumberInteger,
    msgNumberLessThan,
    msgNumberGreaterThan,
    msgNumberMin,
} from './const';

export const stringRequiredSchema = (fieldName: string) => Yup.string().required(msgRequired(fieldName));

export const numberSchema = Yup.number().transform(val => (isNaN(val) || isNull(val) ? undefined : val));

export const numberPositiveSchema = (fieldName: string) =>
    numberSchema.positive(msgNumberPositive(fieldName)).integer(msgNumberInteger(fieldName));

export const timestampSchema = Yup.number().transform(val => (isNaN(val) || !val ? dateToUnix(new Date()) : val));

const minLength = 8;
const maxLength = 64;

const emailField = Yup.string().email('Địa chỉ email không hợp lệ.').required('Địa chỉ email là bắt buộc.');

const passwordField = Yup.string()
    .min(8, `Mật khẩu tối thiếu ${minLength} ký tự`)
    .max(65, `Mật khẩu tối đa ${maxLength} ký tự`)
    .matches(/[A-Z]/, 'Mật Khẩu phải có ít nhất 1 kí tự in hoa')
    .matches(/[a-z]/, 'Mật Khẩu phải có ít nhất 1 kí tự in thường')
    .matches(/[0-9]/, 'Mật Khẩu phải có ít nhất 1 kí tự số')
    .matches(/[!@#$%^&*()=_+}{":;'?/<.>,\\|-]/, 'Mật Khẩu phải có ít nhất 1 kí tự đặc biệt')
    .required('Mật khẩu là bắt buộc.');

const minLengthSchema = numberPositiveSchema('Minimum length').when('max_length', {
    is: Number,
    then: numberPositiveSchema('Minimum length')
        .min(0, msgNumberMin('Minimum length', 0))
        .lessThan(Yup.ref('max_length'), msgNumberLessThan('Maximum length')),
});
const maxLengthSchema = numberPositiveSchema('Maximum length').when('min_length', {
    is: Number,
    then: numberPositiveSchema('Maximum length')
        .min(1, msgNumberMin('Maximum length', 1))
        .moreThan(Yup.ref('min_length'), msgNumberGreaterThan('Minimum length')),
});
const minValueSchema = numberSchema.when('max_number', {
    is: Number,
    then: numberSchema.lessThan(Yup.ref('max_number'), msgNumberLessThan('Maximum value')),
});
const maxValueSchema = numberSchema
    .when('min_number', {
        is: Number,
        then: numberSchema.moreThan(Yup.ref('min_number'), msgNumberGreaterThan('Minimum value')),
    })
    .when('min_number', {
        is: (val: number) => val === 0,
        then: numberSchema.moreThan(Yup.ref('min_number'), msgNumberGreaterThan('Minimum value')),
    });

const validationFields = Yup.object().shape(
    {
        type: Yup.number(),
        min_length: minLengthSchema.when('type', {
            is: (val: number) => toNumber(val) === FIELD_VALIDATION_TYPE.LENGTH,
            then: minLengthSchema
                .test('min_length', msgRequired('Minimum length'), (value: any) => !isNaN(value))
                .min(0, msgNumberMin('Minimum length', 0)),
        }),
        max_length: maxLengthSchema.when('type', {
            is: (val: number) => toNumber(val) === FIELD_VALIDATION_TYPE.LENGTH,
            then: maxLengthSchema
                .test('max_length', msgRequired('Maximum length'), (value: any) => !isNaN(value))
                .min(1, msgNumberMin('Maximum length', 1)),
        }),
        min_number: minValueSchema.when('type', {
            is: (val: number) => toNumber(val) === FIELD_VALIDATION_TYPE.NUMBER_RANGE,
            then: minValueSchema.test('min_number', msgRequired('Minimum value'), (value: any) => !isNaN(value)),
        }),
        max_number: maxValueSchema.when('type', {
            is: (val: number) => toNumber(val) === FIELD_VALIDATION_TYPE.NUMBER_RANGE,
            then: maxValueSchema.test('max_number', msgRequired('Maximum value'), (value: any) => !isNaN(value)),
        }),
        min_date: timestampSchema.when('max_date', {
            is: Number,
            then: timestampSchema.lessThan(Yup.ref('max_date'), msgNumberLessThan('Maximum date')),
        }),
        max_date: timestampSchema.when('min_date', {
            is: Number,
            then: timestampSchema.moreThan(Yup.ref('min_date'), msgNumberGreaterThan('Minimum date')),
        }),
        regex: Yup.string().when('type', {
            is: (val: any) => toNumber(val) === FIELD_VALIDATION_TYPE.REGEX,
            then: stringRequiredSchema('Regex'),
        }),
    },
    [
        ['min_length', 'max_length'],
        ['min_number', 'max_number'],
        ['min_date', 'max_date'],
    ],
);

export { emailField, passwordField, validationFields };
