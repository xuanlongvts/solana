import { put, takeLatest, call, select } from 'redux-saga/effects';
import { PublicKey } from '@solana/web3.js';

import { Obj } from '_types';
import { appLoadingActions } from '_commComp/loadingApp/slice';
import * as ApiCall from './apiCall';
import { selectPubkey } from './selector';

import { SendingTypeActions } from '.';

function* getAllStreamsSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: PublicKey = yield select(selectPubkey);
    const result: Obj = yield call(ApiCall.getAllStreams, payload);

    // yield call(ApiCall.getAllStreams);

    yield put(appLoadingActions.loadingClose());
}

export default function* rootSaga() {
    yield takeLatest(SendingTypeActions.getAllStreamsCall.type, getAllStreamsSaga);
}
