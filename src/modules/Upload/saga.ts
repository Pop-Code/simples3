import { takeLatest, takeEvery, delay, take, call, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { loadData, loadDataUpdate, loadDataDone } from '../Loader';
import { upload as uploadApi } from '../../api';
import { Progress } from 'aws-sdk/lib/request';

function uploadApiWithProgress(action: any) {
    return eventChannel(emitter => {
        const asyncUpload = async () => {
            try {
                const response = await uploadApi(action.payload, (progress: Progress) => {
                    emitter(loadDataUpdate({ progress }, action.meta));
                });
                emitter(loadDataDone(response, action.meta));
            } catch (e) {
                emitter(loadDataDone(e, action.meta));
            }
        };
        asyncUpload();
        return () => console.log('Done ?');
    });
}

export function* uploadSaga(action: any) {
    try {
        const channel = yield call(uploadApiWithProgress, action);
        while (true) {
            const actionToDispatch = yield take(channel);
            yield put(actionToDispatch);
        }
    } catch (e) {
        yield put(loadDataDone(e, action.meta));
    }
}

function* batchUploadSaga(action: any) {
    const credentials = yield select(state => state.getIn(['data', 'credentials']).toJS());
    for (const [index, file] of action.payload.files.entries()) {
        yield put(
            loadData(
                {
                    ...credentials,
                    file
                },
                `${action.meta}.items.${index}`
            )
        );
        yield delay(300);
    }
}

export default function* saga() {
    // TODO do not use the loader reducer to perform upload
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && action.meta === 'upload', batchUploadSaga);

    yield takeEvery(
        (action: any) => action.type === 'LOAD_DATA' && /^upload\.items\..+$/.test(action.meta),
        uploadSaga
    );
}
