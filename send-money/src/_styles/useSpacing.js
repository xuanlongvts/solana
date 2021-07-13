import makeStyles from '@material-ui/styles/makeStyles';

const useSpacing = makeStyles(theme => ({
    mBottom8: {
        marginBottom: `${theme.spacing(1)}px !important`,
    },
    mBottom12: {
        marginBottom: `${theme.spacing(1.5)}px !important`,
    },
    mBottom16: {
        marginBottom: `${theme.spacing(2)}px !important`,
    },
    mBottom20: {
        marginBottom: `${theme.spacing(2.5)}px !important`,
    },
    mBottom28: {
        marginBottom: `${theme.spacing(3.5)}px !important`,
    },
    mBottom36: {
        marginBottom: `${theme.spacing(4.5)}px !important`,
    },
    mBottom56: {
        marginBottom: `${theme.spacing(7)}px !important`,
    },
}));

export default useSpacing;
