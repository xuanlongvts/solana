import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useSpacing = makeStyles((theme: Theme) => ({
    mTop8: {
        marginTop: `${theme.spacing(1)} !important`,
    },
    mTop16: {
        marginTop: `${theme.spacing(2)} !important`,
    },
    mTop24: {
        marginTop: `${theme.spacing(3)} !important`,
    },
    mBottom8: {
        marginBottom: `${theme.spacing(1)} !important`,
    },
    mBottom12: {
        marginBottom: `${theme.spacing(1.5)} !important`,
    },
    mBottom16: {
        marginBottom: `${theme.spacing(2)} !important`,
    },
    mBottom20: {
        marginBottom: `${theme.spacing(2.5)} !important`,
    },
    mBottom28: {
        marginBottom: `${theme.spacing(3.5)} !important`,
    },
    mBottom36: {
        marginBottom: `${theme.spacing(4.5)} !important`,
    },
    mBottom56: {
        marginBottom: `${theme.spacing(7)} !important`,
    },
}));

export default useSpacing;
