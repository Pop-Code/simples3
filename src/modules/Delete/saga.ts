import { takeLatest, call, put, select } from 'redux-saga/effects';
import { loadDataDone, resetData, loadDataUpdate, selectLoaderAtPath } from '../Loader';
import { deleteFile as deleteApi, DeleteRequest } from '../../api';
import { fromJS } from 'immutable';
import { deleteState } from '../Data';
import { AWSFile } from '../File/types';

export function* deleteSaga(action: { type: string; payload: DeleteRequest; meta: string }) {
    try {
        const credentials = yield select(state => state.getIn(['data', 'credentials']));
        let params = fromJS(action.payload || {});
        params = params.merge(credentials);
        const data = yield call(deleteApi, params.toJS());

        yield put(loadDataDone(data, action.meta));
        // hide the dialog
        yield put(deleteState('showDeleteDialog'));
        yield put(deleteState('selectedFiles'));

        // remove items from list data
        let listData = yield select(state => selectLoaderAtPath(state, ['list', 'data', 'data']));
        listData = listData.filter((file: AWSFile) => action.payload.files.indexOf(file.Key) === -1);

        let count = yield select(state => selectLoaderAtPath<number>(state, ['list', 'data', 'count'], 0));
        count = count - action.payload.files.length;
        yield put(
            loadDataUpdate(
                {
                    data: listData,
                    count
                },
                ['list', 'data']
            )
        );
    } catch (e) {
        yield put(loadDataDone(e, action.meta));
    }
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && /^delete$/.test(action.meta), deleteSaga);

    // dialog close
    yield takeLatest(
        (action: any) => action.type === 'DELETE_STATE' && 'showDeleteDialog' === action.meta,
        function*() {
            yield put(resetData('delete'));
        }
    );
}
