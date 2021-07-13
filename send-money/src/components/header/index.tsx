import { FC, ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Switch, { SwitchProps, SwitchClassKey } from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
    root: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        height: '55px',
    },
    title: {
        color: '#eeeeee',
    },
});

interface Styles extends Partial<Record<SwitchClassKey, string>> {
    focusVisible?: string;
}

interface Props extends SwitchProps {
    classes: Styles;
}

const IOSSwitch = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 42,
            height: 26,
            padding: 0,
            margin: theme.spacing(1),
        },
        switchBase: {
            padding: 1,
            '&$checked': {
                transform: 'translateX(16px)',
                color: theme.palette.common.white,
                '& + $track': {
                    backgroundColor: '#303030',
                    opacity: 1,
                    border: 'none',
                },
            },
            '&$focusVisible $thumb': {
                color: '#303030',
                border: '6px solid #fff',
            },
        },
        thumb: {
            width: 24,
            height: 24,
        },
        track: {
            borderRadius: 26 / 2,
            border: `1px solid ${theme.palette.grey[400]}`,
            backgroundColor: theme.palette.grey[50],
            opacity: 1,
            transition: theme.transitions.create(['background-color', 'border']),
        },
        checked: {},
        focusVisible: {},
    }),
)(({ classes, ...props }: Props) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

type headerProps = {
    dark: boolean;
    handleThemeChange: () => void;
};

const Header: FC<headerProps> = ({ dark, handleThemeChange }): ReactElement => {
    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.root}>
            <FormControlLabel
                control={<IOSSwitch checked={dark} onChange={handleThemeChange} name="checkedB" />}
                label={dark ? 'Dark' : 'Light'}
            />
            <Typography variant="h6" gutterBottom className={classes.title}>
                Send Money on Solana
            </Typography>
        </AppBar>
    );
};

export default Header;
