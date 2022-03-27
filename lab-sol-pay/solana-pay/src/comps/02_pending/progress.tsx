import { useEffect, useMemo, useState } from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { PaymentStatus } from '_config';

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number; statusmess: string }) => {
    console.log('value ---> ', props.value);

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {props.statusmess}
                </Typography>
            </Box>
        </Box>
    );
};

type T_Progress = {
    progress: number;
    status: string;
};
const Progress = ({ progress, status }: T_Progress) => {
    const [value, statusMess] = useMemo(() => {
        let newStatus: any = PaymentStatus.Pending;
        switch (status) {
            case PaymentStatus.Finalized:
                return [100, 'Complete'];
            case PaymentStatus.Confirmed:
            case PaymentStatus.Valid:
                if (progress >= 1) {
                    return [100, 'Complete'];
                } else {
                    const val = Number(progress.toFixed(2)) * 100;
                    return [val, val + ' %'];
                }
            case PaymentStatus.InValid:
                newStatus = PaymentStatus.InValid;
                return [0, newStatus];
            default:
                return [0, PaymentStatus.Pending];
        }
    }, [status, progress]);

    return (
        <div className="progress_box">
            <CircularProgressWithLabel value={value} statusmess={statusMess} />
        </div>
    );
};

export default Progress;
