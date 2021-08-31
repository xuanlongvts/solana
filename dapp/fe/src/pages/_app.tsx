import { useState, useEffect, FC } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import globalStyled from 'assets/styles/global';
import theme from 'themes';
import { wrapperStore } from '_redux/configureStore';
import ENV, { envName } from '_config';

import LoadingApp from '_commComp/loadingApp';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import { selectModeType } from 'themes/darkMode/slice/selector';

enum routerEvents {
    start = 'routeChangeStart',
    done = 'routeChangeComplete',
    err = 'routeChangeError',
}
type T_APP = {
    Component: FC;
    pageProps: any;
};
const App = ({ Component, pageProps }: T_APP) => {
    const dispatch = useDispatch();
    const darkState = useSelector(selectModeType);

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleHasLoading = () => setLoading(true);
    const handleHasNotLoading = () => setLoading(false);

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && ENV === envName.production) {
            jssStyles!.parentElement!.removeChild(jssStyles);
        }

        Router.events.on(routerEvents.start, handleHasLoading);
        Router.events.on(routerEvents.done, handleHasNotLoading);
        Router.events.on(routerEvents.err, handleHasNotLoading);

        return () => {
            Router.events.off(routerEvents.start, handleHasLoading);
            Router.events.off(routerEvents.done, handleHasNotLoading);
            Router.events.off(routerEvents.err, handleHasNotLoading);
        };
    }, []);

    useEffect(() => {
        isLoading ? dispatch(appLoadingActions.loadingOpen()) : dispatch(appLoadingActions.loadingClose());
    }, [isLoading]);

    return (
        <ThemeProvider theme={theme(darkState)}>
            <CssBaseline />
            <style jsx global>
                {globalStyled}
            </style>

            <Component {...pageProps} />

            <LoadingApp />
        </ThemeProvider>
    );
};

export default wrapperStore.withRedux(App);
