import { useState } from 'react';
import { useSelector } from 'react-redux';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { darkThemeModes } from 'themes/const';
import SwitchThemeMode from 'themes/darkMode';

import SliceAccount from 'components/02-create-account/slice';
import * as Selectors from 'components/02-create-account/slice/selector';

import Stores from './storage';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            backgroundColor: theme.palette.primary.light,
            cursor: 'pointer',
            color:
                theme.palette.type === darkThemeModes.dark
                    ? theme.palette.primary.contrastText
                    : theme.palette.secondary.contrastText,

            '&:hover': {
                backgroundColor: theme.palette.secondary.light,
            },
        },
        sub: {
            border: '1px solid',
            width: 320,
            padding: theme.spacing(2),
            backgroundColor:
                theme.palette.type === darkThemeModes.dark
                    ? theme.palette.background.default
                    : theme.palette.background.paper,
            marginTop: theme.spacing(1),
            position: 'absolute',
            right: 0,

            '&::after': {
                position: 'absolute',
                content: `''`,
                top: -7,
                right: 5,
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '6px solid',
            },
        },
        store: {
            position: 'relative',
        },
    }),
);

const Header = () => {
    SliceAccount();
    const classes = useStyles();
    const [openAway, setOpenAway] = useState<boolean>(false);

    const address = useSelector(Selectors.selectAddress);

    const handleClick = () => {
        address ? setOpenAway(prv => !prv) : null;
    };

    const handleClickAway = () => {
        setOpenAway(false);
    };

    return (
        <header>
            <SwitchThemeMode />

            <div className={classes.store}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <span>
                        <Paper variant="outlined" square className={classes.paper} onClick={handleClick}>
                            Storage
                        </Paper>
                        {openAway ? (
                            <Paper variant="outlined" square className={classes.sub}>
                                <Stores />
                            </Paper>
                        ) : null}
                    </span>
                </ClickAwayListener>
            </div>
        </header>
    );
};

export default Header;
