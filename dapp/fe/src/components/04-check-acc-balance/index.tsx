import { useState } from 'react';
import type { NextPage } from 'next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

import useSpacing from 'assets/styles/useSpacing';
import useSectionWrap from 'assets/styles/sectionWrap';
import SidebarConfig from '_commComp/sidebar/consts';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { ENUM_FIELDS, add_acc } from '_validate';
import ButtonActs from '_commComp/btn';

const AddressAccountSchema = Yup.object().shape({
    [ENUM_FIELDS.address_account]: add_acc,
});

type T_HOOK_FORMS = {
    address_account: string;
};

const BalancePage: NextPage = () => {
    const classes = useSpacing();
    const classSelf = useSectionWrap();

    const dispatch = useDispatch();

    const [fetch, setFetch] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_HOOK_FORMS>({
        mode: 'onBlur',
        resolver: yupResolver(AddressAccountSchema),
    });

    const onSubmitForm = (data: T_HOOK_FORMS) => {
        dispatch(appLoadingActions.loadingOpen());
        setFetch(true);
        axios
            .post('/api/balance', { ...data })
            .then(res => {
                setBalance(res.data);
                setFetch(false);
                dispatch(appLoadingActions.loadingClose());
            })
            .catch(err => {
                dispatch(appLoadingActions.loadingClose());
                setFetch(false);
            });
    };

    const disabledBtn = !!(errors[ENUM_FIELDS.address_account] || !watch()[ENUM_FIELDS.address_account]);

    return (
        <section>
            <Typography variant="h5" gutterBottom>
                {SidebarConfig[3].title}
            </Typography>
            <div className={classSelf.wrap}>
                <div className={classes.mBottom20}>
                    <Typography variant="body2" gutterBottom>
                        Paste the address you generated previously:
                    </Typography>
                </div>
                <form className={classes.mBottom20}>
                    <div style={{ width: 500 }}>
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
                        <Button
                            variant="contained"
                            color="secondary"
                            size="medium"
                            endIcon={fetch ? <CircularProgress color="inherit" size={20} /> : null}
                            style={{ textTransform: 'initial' }}
                            disabled={disabledBtn}
                            onClick={handleSubmit(onSubmitForm)}
                        >
                            Check Balance
                        </Button>
                    </div>
                </form>

                {balance || balance === 0 ? (
                    <Alert severity="success" variant="outlined" className={classSelf.alertBox}>
                        <Typography variant="subtitle1" gutterBottom>
                            This address has a balance of{' '}
                            <strong>{balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1.')}</strong> SOL
                        </Typography>
                    </Alert>
                ) : null}
            </div>

            <ButtonActs prevLink={SidebarConfig[2].link} nextLink={SidebarConfig[4].link} />
        </section>
    );
};

export default BalancePage;
