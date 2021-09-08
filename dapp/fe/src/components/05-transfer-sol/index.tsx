import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Keypair } from '@solana/web3.js';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

import FileCopy from '@material-ui/icons/FileCopy';
import DoneIcon from '@material-ui/icons/Done';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { transactionExplorer } from '_config';
import * as Selectors from 'components/02-create-account/slice/selector';
import { accountKeypairActions } from 'components/02-create-account/slice';
import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import SidebarConfig from '_commComp/sidebar/consts';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import FundAccSchema, { T_HOOKS_FOMR_SEND_LAMPORTS, ENUM_FIELDS } from '_validate';
import ButtonActs from '_commComp/btn';

const TransferSolPage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();

    const dispatch = useDispatch();

    const [fetch, setFetch] = useState<boolean>(false);
    const [hash, setHash] = useState<string | null>(null);

    const [address_to, setAddressTo] = useState<string | null>(null);

    const address = useSelector(Selectors.selectAddress);
    const key_cpy = useSelector(Selectors.selectAccoun_cpy);
    const secretKey = useSelector(Selectors.selectAccount_secret_key);

    const generateKeypair = async () => {
        const keypair = Keypair.generate();
        const address = keypair.publicKey.toString();
        setAddressTo(address);
    };

    const timeOutCpy = (t: number) => {
        setTimeout(() => {
            dispatch(accountKeypairActions.setClearCpy());
        }, t);
    };

    const hanldeCpy = (filed: string) => {
        dispatch(accountKeypairActions.setCpy(filed));

        timeOutCpy(3000);
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR_SEND_LAMPORTS>({
        mode: 'onBlur',
        resolver: yupResolver(FundAccSchema),
    });

    const onSubmitForm = (data: T_HOOKS_FOMR_SEND_LAMPORTS) => {
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);
        const dataSend = {
            address,
            secret: secretKey,
            recipient: data[ENUM_FIELDS.address_account],
            lamports: data[ENUM_FIELDS.number_lamports],
        };

        axios
            .post('/api/transfer', { ...dataSend })
            .then(res => {
                setHash(res.data);
                setFetch(false);
                dispatch(appLoadingActions.loadingClose());
            })
            .catch(err => {
                dispatch(appLoadingActions.loadingClose());
                setFetch(false);
            });
    };

    const disabledBtn = !!(
        errors[ENUM_FIELDS.address_account] ||
        errors[ENUM_FIELDS.number_lamports] ||
        !watch()[ENUM_FIELDS.address_account] ||
        !watch()[ENUM_FIELDS.number_lamports]
    );

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[4].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        Sender: <code>{address}</code>
                    </Typography>
                </div>
                <form className={classes.mBottom20}>
                    <div style={{ width: 500 }}>
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.number_lamports}
                            label="Lamports (1 SOL = 1 bilion lamports)"
                            placeholder="1000000000"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.number_lamports)}
                            error={!!errors[ENUM_FIELDS.number_lamports]}
                            helperText={errors[ENUM_FIELDS.number_lamports]?.message}
                        />
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            id={ENUM_FIELDS.address_account}
                            label="Address account recieve SOL"
                            placeholder="xxx"
                            type="text"
                            margin="normal"
                            {...register(ENUM_FIELDS.address_account)}
                            error={!!errors[ENUM_FIELDS.address_account]}
                            helperText={errors[ENUM_FIELDS.address_account]?.message}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            style={{ textTransform: 'initial' }}
                            onClick={generateKeypair}
                        >
                            Generate an address
                        </Button>

                        {address_to ? (
                            <div className={classes.mTop16} style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="caption" gutterBottom>
                                    <kbd>{address_to}</kbd>
                                </Typography>

                                <span style={{ marginLeft: 20, display: 'inline-block', width: 30 }}>
                                    {key_cpy === ENUM_FIELDS.address_account ? (
                                        <DoneIcon />
                                    ) : (
                                        <CopyToClipboard
                                            text={address_to as string}
                                            onCopy={() => hanldeCpy(ENUM_FIELDS.address_account)}
                                        >
                                            <FileCopy fontSize="small" />
                                        </CopyToClipboard>
                                    )}
                                </span>
                            </div>
                        ) : null}
                        <div className={classes.mTop32}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="medium"
                                endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                                style={{ textTransform: 'initial' }}
                                disabled={disabledBtn}
                                onClick={handleSubmit(onSubmitForm)}
                            >
                                Submit Transfer
                            </Button>
                        </div>
                    </div>
                </form>

                {hash ? (
                    <Alert severity="success" variant="outlined" className={classSelf.alertBox}>
                        <Typography variant="subtitle1" gutterBottom>
                            Address Funded!{' '}
                            <Link href={transactionExplorer(hash)} target="_blank" rel="noreferrer">
                                View on Solana Explorer
                            </Link>
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink={SidebarConfig[3].link} nextLink={SidebarConfig[5].link} />
        </section>
    );
};

export default TransferSolPage;
