import { PublicKey } from '@solana/web3.js';

import http from '_services/api';

export const getAllStreams = (pubkey: PublicKey): Promise<any> => {
    return http()
        .fetch(`/${pubkey}`)
        .then((resp: any) => {
            if (resp.status === 200) {
                return {
                    result: resp.data,
                };
            }
            return {
                errMess: 'Something went wrong',
            };
        })
        .catch((err: any) => ({
            errMess: err || 'Something went wrong',
        }));
};
