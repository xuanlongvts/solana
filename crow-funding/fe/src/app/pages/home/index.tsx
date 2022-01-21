import { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getAllCampaigns, I_RESULT_ALL_CAMPAINS } from 'app/solana';
import { appLoadingActions } from 'app/_commComp/loadingApp/slice';

import { useCampainsTypeSlice, campainsTypeActions } from './slice';
import * as TYPES_KEYS from './slice/types';
import * as Selectors from './slice/selector';

const Home = (): ReactElement => {
    useCampainsTypeSlice();

    const dispatch = useDispatch();

    const getAllCampains = useSelector(Selectors.selectCampains);

    useEffect(() => {
        dispatch(appLoadingActions.loadingOpen());

        getAllCampaigns().then((item: I_RESULT_ALL_CAMPAINS[]) => {
            dispatch(campainsTypeActions.setAllCampaigns(item));
            dispatch(appLoadingActions.loadingClose());
        });
    }, []);

    return <section>Home</section>;
};

export default Home;
