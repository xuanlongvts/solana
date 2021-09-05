type T_FIELD_VALIDATION_TYPE = {
    LENGTH: number;
    NUMBER_RANGE: number;
    DATE_RANGE: number;
    FIXED: number;
    REGEX: number;
};
export const FIELD_VALIDATION_TYPE: T_FIELD_VALIDATION_TYPE = {
    LENGTH: 0,
    NUMBER_RANGE: 1,
    DATE_RANGE: 2,
    FIXED: 3,
    REGEX: 4,
};
