import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import { appLoadingActions } from '_commComp/loadingApp/slice';
import useSpacing from 'assets/styles/useSpacing';
import SidebarConfig from '_commComp/sidebar/consts';
import ButtonActs from '_commComp/btn';

import FundAccSchema from './validateSchema';
import { T_HOOKS_FOMR, ENUM_FIELDS } from './const';

const styles = makeStyles((theme: Theme) => ({
    wrap: {
        height: '100%',
        padding: `${theme.spacing(2)}px 0`,
    },
    root: {
        '& .MuiAlert-icon': {
            paddingTop: 12,
        },
    },
    addFill: {
        width: 500,
    },
}));

export const transactionExplorer = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
};

const FundToAccountPage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = styles();
    const dispatch = useDispatch();

    const [fetch, setFetch] = useState<boolean>(false);
    const [hash, setHash] = useState<string>('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOKS_FOMR>({
        mode: 'onBlur',
        resolver: yupResolver(FundAccSchema),
    });

    const onSubmitForm = (data: T_HOOKS_FOMR) => {
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);
        axios
            .post('/api/fund', { ...data })
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
                Fund the account with SOL
            </Typography>

            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        Paste the address you generated (you can copy it in the top right corner of the page):
                    </Typography>
                    <form className={classes.mBottom20}>
                        <div className={classSelf.addFill}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                id={ENUM_FIELDS.address_account}
                                label="Address account"
                                placeholder="xxx"
                                type="text"
                                margin="normal"
                                {...register(ENUM_FIELDS.address_account)}
                                error={!!errors[ENUM_FIELDS.address_account]}
                                helperText={errors[ENUM_FIELDS.address_account]?.message}
                            />
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
                        </div>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="medium"
                            endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                            style={{ textTransform: 'initial' }}
                            disabled={disabledBtn}
                            onClick={handleSubmit(onSubmitForm)}
                        >
                            Fund this address
                        </Button>
                    </form>

                    {hash ? (
                        <Alert severity="success" variant="outlined" className={classSelf.root}>
                            <Typography variant="subtitle1" gutterBottom>
                                Address Funded!{' '}
                                <Link href={transactionExplorer(hash)} target="_blank" rel="noreferrer">
                                    View on Solana Explorer
                                </Link>
                            </Typography>
                        </Alert>
                    ) : null}
                </div>
            </div>

            <ButtonActs prevLink={SidebarConfig[1].link} nextLink={SidebarConfig[3].link} />
        </section>
    );
};

export default FundToAccountPage;
