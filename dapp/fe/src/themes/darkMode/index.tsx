import { useSelector, useDispatch } from 'react-redux';

import Switch from '@material-ui/core/Switch';

import { darkThemeModes } from '../const';
import { selectModeType } from './slice/selector';
import { useDarkModeTypeSlice } from './slice';

const DarkMode = () => {
    const { actions } = useDarkModeTypeSlice();
    const darkState = useSelector(selectModeType);

    const dispatch = useDispatch();

    const handleThemeChange = () => {
        dispatch(actions.changeDarkModeType());
    };

    return <Switch checked={darkState === darkThemeModes.dark} onChange={handleThemeChange} />;
};

export default DarkMode;
