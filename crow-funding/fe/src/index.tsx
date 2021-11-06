import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';

import ThemeProviderContainer from 'styles/theme/ThemeProvider';
import StoreApp from 'app/_redux/configureStore';
import LoadingApp from 'app/_commComp/loadingApp';

import Routes from 'app/_routers';
import reportWebVitals from './reportWebVitals';

import '_styles/_index.scss';

ReactDOM.render(
    <Provider store={StoreApp()}>
        <ThemeProviderContainer>
            <StrictMode>
                <CssBaseline />

                <Routes />

                <LoadingApp />
            </StrictMode>
        </ThemeProviderContainer>
    </Provider>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
