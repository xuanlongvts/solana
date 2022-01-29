import { useState, useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';

import '_styles/_setting.scss';

import theme from 'themes';
import createEmotionCache from 'themes/createEmotionCache';
import { selectModeType } from 'themes/darkMode/slice/selector';
import { wrapperStore } from '_redux/configureStore';

import LoadingApp from '_commComp/loadingApp';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import Nav from '_commComp/sidebar';
import Header from '_commComp/header';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

enum routerEvents {
    start = 'routeChangeStart',
    done = 'routeChangeComplete',
    err = 'routeChangeError',
}

type T_APP = {
    Component: FC;
    pageProps: any;
    emotionCache?: EmotionCache;
};

const App = (props: T_APP) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

    const dispatch = useDispatch();
    const darkState = useSelector(selectModeType);

    const [isLoading, setLoading] = useState<boolean>(false);

    const handleHasLoading = () => setLoading(true);
    const handleHasNotLoading = () => setLoading(false);

    useEffect(() => {
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
        <CacheProvider value={emotionCache}>
            <Head>
                <title>My page</title>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme(darkState)}>
                <CssBaseline />

                <Nav />
                <main>
                    <Header />
                    <Component {...pageProps} />
                </main>
                <LoadingApp />
            </ThemeProvider>
        </CacheProvider>
    );
};

export default wrapperStore.withRedux(App);
