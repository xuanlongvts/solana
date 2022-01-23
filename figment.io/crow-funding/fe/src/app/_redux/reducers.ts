import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

import history from 'app/_routers/history';
import { InjectedReducersType } from '_types/injector_typings';

const createReducer = (injectedReducers: InjectedReducersType = {}) => {
    return combineReducers({
        router: connectRouter(history),
        ...injectedReducers,
    });
};

export default createReducer;
