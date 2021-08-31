const env = process.env.ENV;

export enum ENUM_envName {
    dev = 'dev',
    qc = 'qc',
    uat = 'uat',
    production = 'production',
}
type T_envName = {
    dev: string;
    qc: string;
    uat: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.qc]: 'qc',
    [ENUM_envName.uat]: 'uat',
    [ENUM_envName.production]: 'production',
};

export default env;
