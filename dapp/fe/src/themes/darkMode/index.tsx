import { useSelector, useDispatch } from 'react-redux';
import NoSsr from '@material-ui/core/NoSsr';
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

    return (
        <NoSsr>
            <Switch checked={darkState === darkThemeModes.dark} onChange={handleThemeChange} />
        </NoSsr>
    );
};

export default DarkMode;
