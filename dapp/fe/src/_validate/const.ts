export const msgRequired = (fieldName: string) => `${fieldName} is required.`;

export const msgNumberLessThan = (fieldName: string) =>
    `Should less than ${fieldName}`;

export const msgNumberGreaterThan = (fieldName: string) =>
    `Should greater than ${fieldName}`;

export const msgNumberPositive = (fieldName: string) =>
    `${fieldName} must be a positive number`;

export const msgNumberInteger = (fieldName: string) =>
    `${fieldName} must be an integer`;

export const msgNumberMin = (fieldName: string, min: number) =>
    `${fieldName} must be greater than or equal to ${min}`;
