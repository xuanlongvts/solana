import { PublicKey } from '@solana/web3.js';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { appLoadingActions } from 'app/_commComp/loadingApp/slice';
import useSpacing from '_styles/useSpacing';

import { donateToCampaign } from 'app/solana';
import { ONE_SOL_UNIT_LAMPORT } from './const';

enum enum_field_donate {
    donate = 'amount_donate',
}

type T_donate = {
    [enum_field_donate.donate]: number;
};

const min_donate = 1;
const max_donate = 1000000;
const DonateField = Yup.number()
    .min(min_donate, `Donate min ${min_donate}`)
    .max(max_donate, `Donate max ${max_donate}`)
    .required('Donate required');

const DonateSchema = Yup.object().shape({
    [enum_field_donate.donate]: DonateField,
});

const FrmDonate = ({ pubId }: { pubId: PublicKey }) => {
    const dispatch = useDispatch();
    const spacing = useSpacing();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_donate>({
        mode: 'onBlur',
        resolver: yupResolver(DonateSchema),
    });

    const onSubmitForm = async (data: T_donate) => {
        dispatch(appLoadingActions.loadingOpen());
        const lamportConvertToSol = data[enum_field_donate.donate] * ONE_SOL_UNIT_LAMPORT;
        await donateToCampaign(pubId, lamportConvertToSol);
        dispatch(appLoadingActions.loadingClose());
    };

    const disabledBtn = !!(errors[enum_field_donate.donate] || !watch()[enum_field_donate.donate]);

    return (
        <form className="frm_acts">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        id={enum_field_donate.donate}
                        type="text"
                        label="Amount to donate"
                        placeholder="1"
                        {...register(enum_field_donate.donate)}
                        error={!!errors[enum_field_donate.donate]}
                        helperText={errors[enum_field_donate.donate]?.message}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        size="large"
                        disabled={disabledBtn}
                        className={spacing.mTop24}
                        onClick={handleSubmit(onSubmitForm)}
                    >
                        Donate
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default FrmDonate;
