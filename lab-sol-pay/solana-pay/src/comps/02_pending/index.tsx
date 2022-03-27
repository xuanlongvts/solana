import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import {
    createTransaction,
    encodeURL,
    findTransactionSignature,
    FindTransactionSignatureError,
    parseURL,
    validateTransactionSignature,
    ValidateTransactionSignatureError,
} from '@solana/pay';
import { ConfirmedSignatureInfo, Keypair, PublicKey, TransactionSignature } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import BigNumber from 'bignumber.js';

import { PubkeyRecipient, PaymentStatus, requiredConfirmations, Confirmations } from '_config';
import { LocalStorageServices } from '_utils/localStorage';
import { ENUM_FIELDS } from '_validate';

import QRCode from './qr_code';
import Progress from './progress';

const referencePubkey = Keypair.generate().publicKey; // Important for reference receiver transaction confirmed

const Pending = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const router = useRouter();

    const [signature, setSignature] = useState<TransactionSignature>();
    const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
    const [reference, setReference] = useState<PublicKey>(referencePubkey);
    const [confirmations, setConfirmations] = useState<Confirmations>(0);

    const progress = useMemo(() => confirmations / requiredConfirmations, [confirmations]);

    // useEffect(() => {
    //     let value = 0;
    //     let newStatus: any = PaymentStatus.Pending;
    //     switch (status) {
    //         case PaymentStatus.Finalized:
    //             value = 1;
    //             newStatus = 'Complete';
    //         case PaymentStatus.Confirmed:
    //         case PaymentStatus.Valid:
    //             if (progress >= 1) {
    //                 value = 1;
    //                 newStatus = 'Complete';
    //             } else {
    //                 value = progress;
    //                 newStatus = Math.round(progress * 100) + '%';
    //             }
    //         case PaymentStatus.InValid:
    //             value = 0;
    //             newStatus = PaymentStatus.InValid;
    //     }
    // }, [status, progress]);

    // 1. Status pending ---> Phone Pay
    useEffect(() => {
        if (signature || status !== PaymentStatus.Pending || !reference) {
            return;
        }

        let changed = false;
        const interval = setInterval(async () => {
            let signature: ConfirmedSignatureInfo;
            try {
                signature = await findTransactionSignature(connection, referencePubkey, undefined, 'confirmed');

                if (!changed) {
                    clearInterval(interval);
                    setSignature(signature.signature);
                    setStatus(PaymentStatus.Confirmed);
                }
            } catch (err: any) {
                // If the RPC node doesn't have the transaction signature yet, try again
                if (!(err instanceof FindTransactionSignatureError)) {
                    console.log('1. Phone Pay --->>> Error: ', err);
                }
            }
        }, 300);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, reference, connection]);

    // 2. Status confirmed, check valid informations again ---> Phone Pay
    useEffect(() => {
        const getAmount = new BigNumber(LocalStorageServices.getItemJson(ENUM_FIELDS.amount));
        if (!signature || status !== PaymentStatus.Confirmed || !getAmount) {
            return;
        }
        let changed = false;
        let timeout: any;

        const run = async () => {
            try {
                // splToken (later version)
                await validateTransactionSignature(connection, signature, PubkeyRecipient, getAmount, undefined, reference, 'confirmed');
                if (!changed) {
                    // console.log('status: ', status);
                    setStatus(PaymentStatus.Valid);
                    changed = true;
                }
            } catch (err: any) {
                if (err instanceof ValidateTransactionSignatureError && (err.message === 'not found' || err.message === 'missing meta')) {
                    console.warn('2.0 Error validate: ', err);
                    timeout = setTimeout(run, 250);
                    return;
                }

                console.warn('2.1 Phone Pay validate --->>> Error: ', err);
                setStatus(PaymentStatus.InValid);
                LocalStorageServices.removeAll();

                router.push('/');
            }
        };
        timeout = setTimeout(run, 0);

        return () => {
            clearTimeout(timeout);
            changed = true;
        };
    }, [status, signature, reference, connection]);

    // 3. Status valid, poll for confirmations until the transaction is finalized ---> Phone Pay
    useEffect(() => {
        if (!signature || status !== PaymentStatus.Valid) {
            return;
        }
        let changed = false;

        const interval = setInterval(async () => {
            try {
                const response = await connection.getSignatureStatus(signature);

                const status = response.value;
                // console.log('status: ---> ', status);
                if (!status) {
                    return;
                }
                if (status.err) {
                    throw status.err;
                }

                if (!changed) {
                    const confirmations = (status.confirmations || 0) as Confirmations;
                    setConfirmations(confirmations);

                    if (confirmations >= requiredConfirmations || status.confirmationStatus === 'finalized') {
                        clearInterval(interval);
                        setStatus(PaymentStatus.Finalized);

                        changed = true;
                        // LocalStorageServices.removeAll();
                        // router.push('/03-confirm');
                    }
                }
            } catch (err: any) {
                console.warn('3. Phone Pay consensus --->>> Error: ', err);
            }
        }, 300);

        return () => {
            changed = true;
            clearInterval(interval);
        };
    }, [status, signature, connection]);

    return (
        <section>
            <QRCode refPubkey={referencePubkey} />

            <Progress status={status} progress={progress} />
        </section>
    );
};

export default Pending;
