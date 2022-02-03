import { put, takeLatest, call, select } from 'redux-saga/effects';
import { PublicKey } from '@solana/web3.js';

import { appLoadingActions } from '_commComp/loadingApp/slice';
import * as ApiCall from './apiCall';
import { selectPubkey } from './selector';
import { SendingTypeActions } from '.';

function* getAllStreamsSaga() {
    yield put(appLoadingActions.loadingOpen());

    const payload: PublicKey = yield select(selectPubkey);
    const { result } = yield call(ApiCall.getAllStreams, payload);

    yield put(
        SendingTypeActions.getAllStreamsSuccess({
            result,
        }),
    );

    yield put(appLoadingActions.loadingClose());
}

export default function* rootSaga() {
    yield takeLatest(SendingTypeActions.getAllStreamsCall.type, getAllStreamsSaga);
}
