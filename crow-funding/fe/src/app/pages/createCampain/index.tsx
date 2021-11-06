import { ChangeEvent, SyntheticEvent, FC, ReactElement, useState } from 'react';
import TextField from '@mui/material/TextField';

import useSpacing from '_styles/useSpacing';

const CreateCampain = () => {
    const spacing = useSpacing();

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (val && Number.isInteger(val)) {
            // setErrAmount(false);
            // setAmount(Number(val));
        } else {
            // setErrAmount(errMess.amount);
        }
    };

    return (
        <section>
            <TextField
                id="title"
                fullWidth
                label="Title"
                variant="outlined"
                onChange={handleAmountChange}
                className={spacing.mBottom12}
                // error={!!errAmount}
                // helperText={errAmount}
            />
        </section>
    );
};

export default CreateCampain;
