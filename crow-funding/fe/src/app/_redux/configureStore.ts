import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';

import ENV, { envName } from '_config';
import history from 'app/_routers/history';

import rootSaga from './sagas';
import createReducer from './reducers';

const storeConfig = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware({});
    const routesMiddleware = routerMiddleware(history);

    const middlewares = [sagaMiddleware, routesMiddleware];

    const enhancers = [
        createInjectorsEnhancer({
            createReducer,
            runSaga: sagaMiddleware.run,
        }),
    ] as StoreEnhancer[];

    const store = configureStore({
        reducer: createReducer(),
        preloadedState: initialState,
        middleware: [...middlewares],
        devTools: ENV !== envName.production,
        enhancers,
    });

    sagaMiddleware.run(rootSaga);

    return store;
};

export default storeConfig;
