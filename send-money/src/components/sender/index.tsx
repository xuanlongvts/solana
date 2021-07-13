import { ChangeEvent, SyntheticEvent, FC, ReactElement, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import useSpacing from '_styles/useSpacing';

import { sendMoney } from '_coreActions/wallet';

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
    const spacing = useSpacing();

    const [errAmount, setErrAmount] = useState<string | boolean>('');
    const [errAddress, setErrAddress] = useState<string | boolean>('');

    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);

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
        if (errAmount !== false || errAddress !== false) {
            return;
        }
        const result = await sendMoney(address, amount);
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
        </>
    );
};

export default Sender;
