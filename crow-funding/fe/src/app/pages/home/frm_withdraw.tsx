import { ChangeEvent } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { appLoadingActions } from 'app/_commComp/loadingApp/slice';
import useSpacing from '_styles/useSpacing';

enum enum_field_withdraw {
    withdraw = 'amount_withdraw',
}

type T_withdraw = {
    [enum_field_withdraw.withdraw]: number;
};

const min_withdraw = 1;
const max_withdraw = 1000000;
const WithdrawField = Yup.number()
    .min(min_withdraw, `Withdraw min ${min_withdraw}`)
    .max(max_withdraw, `Withdraw max ${max_withdraw}`)
    .required('Withdraw required');

const WithdrawSchema = Yup.object().shape({
    [enum_field_withdraw.withdraw]: WithdrawField,
});

const FrmWithDraw = () => {
    const dispatch = useDispatch();
    const spacing = useSpacing();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<T_withdraw>({
        mode: 'onBlur',
        resolver: yupResolver(WithdrawSchema),
    });

    const onSubmitForm = async (data: T_withdraw) => {
        dispatch(appLoadingActions.loadingOpen());
        // dispatch(appLoadingActions.loadingClose());
    };

    const disabledBtn = !!(errors[enum_field_withdraw.withdraw] || !watch()[enum_field_withdraw.withdraw]);

    return (
        <form className="frm_acts">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        required
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        id={enum_field_withdraw.withdraw}
                        type="text"
                        label="Amount to withdraw"
                        placeholder="1"
                        {...register(enum_field_withdraw.withdraw)}
                        error={!!errors[enum_field_withdraw.withdraw]}
                        helperText={errors[enum_field_withdraw.withdraw]?.message}
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
                        Withdraw
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default FrmWithDraw;
