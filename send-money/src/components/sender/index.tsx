import { ChangeEvent, FC, ReactElement, useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import useSpacing from '_styles/useSpacing';

import { sendMoney } from '_coreActions/wallet';

type SenderProps = {
    didSendMoney: () => void;
};

const Sender: FC<SenderProps> = ({ didSendMoney }): ReactElement => {
    const spacing = useSpacing();

    const [address, setAddress] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value.toString());
    };

    const handleSubmit = async () => {
        await sendMoney(address, amount);
        didSendMoney();
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
            />
            <TextField
                id="address"
                fullWidth
                label="Address"
                variant="outlined"
                onChange={handleAddressChange}
                className={spacing.mBottom16}
            />
            <Button variant="outlined" color="primary" size="large" onClick={handleSubmit}>
                Primary
            </Button>
        </>
    );
};

export default Sender;
