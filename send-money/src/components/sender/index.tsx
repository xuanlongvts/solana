import { ChangeEvent, SyntheticEvent, FC, ReactElement, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import useSpacing from '_styles/useSpacing';

import { sendMoney } from '_coreActions/wallet';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type SenderProps = {
    didSendMoney: () => void;
};

const errMess = {
    amount: 'Amount require',
    address: 'Address require',
};

const Sender: FC<SenderProps> = ({ didSendMoney }): ReactElement => {
    const classes = useStyles();

    const spacing = useSpacing();

    const [errAmount, setErrAmount] = useState<string | boolean>('');
    const [errAddress, setErrAddress] = useState<string | boolean>('');

    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [openBackDrop, setOpenBackDrop] = useState<boolean>(false);

    const [openAlert, setOpenAlert] = useState<number>(0);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val && Number.isInteger(val)) {
            setErrAmount(false);
            setAmount(Number(val));
        } else {
            setErrAmount(errMess.amount);
        }
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) {
            setErrAddress(false);
            setAddress(e.target.value.toString());
        } else {
            setErrAddress(errMess.address);
        }
    };

    const handleSubmit = async () => {
        setOpenBackDrop(true);
        if (errAmount !== false || errAddress !== false) {
            setOpenBackDrop(false);
            return;
        }
        const result = await sendMoney(address, amount);
        setOpenBackDrop(false);
        if (result) {
            setOpenAlert(1);

            didSendMoney();
        } else {
            setOpenAlert(2);
        }
    };

    const handleAlertClose = (event?: SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(0);
    };

    return (
        <>
            <TextField
                id="amount"
                fullWidth
                label="Amount (lamports)"
                variant="outlined"
                onChange={handleAmountChange}
                className={spacing.mBottom12}
                error={!!errAmount}
                helperText={errAmount}
            />
            <TextField
                id="address"
                fullWidth
                label="Address"
                variant="outlined"
                onChange={handleAddressChange}
                className={spacing.mBottom16}
                defaultValue={address}
                error={!!errAddress}
                helperText={errAddress}
            />
            <Button variant="outlined" color="primary" size="large" onClick={handleSubmit}>
                Primary
            </Button>

            <Snackbar open={openAlert > 0} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={openAlert && openAlert === 1 ? 'success' : 'error'}>
                    {openAlert && openAlert === 1 ? 'Send success' : 'Send error'}
                </Alert>
            </Snackbar>

            <Backdrop className={classes.backdrop} open={openBackDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default Sender;
