import { makeStyles, Theme } from '@mui/material/styles';

const styles = makeStyles((theme: Theme) => ({
    wrap: {
        height: '100%',
        padding: `${theme.spacing(2)}px 0`,
    },
    alertBox: {
        '& .MuiAlert-icon': {
            paddingTop: 12,
        },
    },
}));

export default styles;
