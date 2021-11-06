const env = process.env.REACT_APP_ENV;

export enum ENUM_envName {
    dev = 'dev',
    qc = 'qc',
    uat = 'uat',
    production = 'production',
    sandbox = 'sandbox',
}
type T_envName = {
    dev: string;
    qc: string;
    uat: string;
    production: string;
    sandbox: string;
};
export const envName: T_envName = {
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.qc]: 'qc',
    [ENUM_envName.uat]: 'uat',
    [ENUM_envName.production]: 'production',
    [ENUM_envName.sandbox]: 'sandbox',
};

export default env;
