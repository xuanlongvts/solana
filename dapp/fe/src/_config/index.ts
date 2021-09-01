const env = process.env.ENV;

export enum ENUM_envName {
    dev = 'dev',
    test = 'test',
    production = 'production',
}
type T_envName = {
    dev: string;
    test: string;
    production: string;
};
export const envName: T_envName = {
    [ENUM_envName.dev]: 'dev',
    [ENUM_envName.test]: 'test',
    [ENUM_envName.production]: 'production',
};

export default env;
