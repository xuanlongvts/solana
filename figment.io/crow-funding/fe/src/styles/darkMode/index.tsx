import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { darkThemeModes } from 'styles/theme/const';
import { selectModeType } from './slice/selector';
import { useDarkModeTypeSlice } from './slice';

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === darkThemeModes.dark ? '#2ECA45' : '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.mode === darkThemeModes.light ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === darkThemeModes.light ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === darkThemeModes.light ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const DarkMode = () => {
    const { actions } = useDarkModeTypeSlice();
    const darkState = useSelector(selectModeType);

    const dispatch = useDispatch();

    const handleThemeChange = () => {
        dispatch(actions.changeDarkModeType());
    };

    return (
        <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked onChange={handleThemeChange} />}
            label={darkState === darkThemeModes.dark ? darkThemeModes.dark : darkThemeModes.light}
        />
    );
};

export default DarkMode;
