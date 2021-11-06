import ENV from '_config';

type T_LocalStorageKey = {
    username: string;
    email: string;
    avatar_url: string;
    routerList: string;
    appVersion: string;
    darkMode: string;
};
const LocalStorageKey = (detectEnv = ENV): T_LocalStorageKey => {
    return {
        username: `${detectEnv}_username`,
        email: `${detectEnv}_email`,
        avatar_url: `${detectEnv}_avatar_url`,
        routerList: `${detectEnv}_routerList`,
        appVersion: `${detectEnv}_appVersion`,
        darkMode: `${detectEnv}_darkMode`,
    };
};

const LocalStorageServices = {
    setItem(key: string, value: any) {
        localStorage.setItem(key, value);
    },

    getItem(key: string) {
        return localStorage.getItem(key);
    },

    getItemJson(key: string) {
        const get = localStorage.getItem(key);
        return get && JSON.parse(get);
    },

    setItemJson(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    removeItem(key: string) {
        localStorage.removeItem(key);
    },

    removeManyItems(keys: Array<string>) {
        Object.values(keys).forEach(item => {
            window.localStorage.removeItem(item);
        });
    },

    removeAll() {
        localStorage.clear();
    },
};

export { LocalStorageServices, LocalStorageKey };
