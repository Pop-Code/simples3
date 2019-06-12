import { Progress } from 'aws-sdk/lib/request';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { upload as uploadApi } from '../../api';
import { list } from '../List';
import { loadData, loadDataDone, loadDataUpdate, resetData } from '../Loader';

function uploadApiWithProgress(action: any) {
    return eventChannel(emitter => {
        const asyncUpload = async () => {
            try {
                emitter(resetData(action.meta));
                const response = await uploadApi(action.payload, (progress: Progress) => {
                    emitter(loadDataUpdate({ progress }, action.meta));
                });
                emitter(loadDataDone(response, action.meta));
            } catch (e) {
                emitter(loadDataDone(e, action.meta));
            }
        };
        asyncUpload();
        return () => console.log('upload done');
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
    const tasks = [];
    for (const [index, file] of action.payload.files.entries()) {
        tasks.push(
            put(
                loadData(
                    {
                        ...credentials,
                        file
                    },
                    `${action.meta}.items.${index}`
                )
            )
        );
    }
    // start all upload tasks
    yield all(tasks);

    // wait for dialog to be closed, and reload list
    yield takeLatest(
        (action: any) => action.type === 'DELETE_STATE' && action.meta === 'showUploadDialog',
        function*() {
            yield put(list());
        }
    );
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && action.meta === 'upload', batchUploadSaga);
    yield takeEvery(
        (action: any) => action.type === 'LOAD_DATA' && /^upload\.items\..+$/.test(action.meta),
        uploadSaga
    );
}
