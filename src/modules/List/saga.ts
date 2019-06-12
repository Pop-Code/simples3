import { takeLatest, call, put, select } from 'redux-saga/effects';
import { list } from '../../api';
import { loadData, loadDataDone, selectLoaderAtPath } from '../Loader';
import { fromJS } from 'immutable';
import { selectFile } from './actions';
import { setState, selectDataAtPath } from '../Data';
import _ from 'lodash';
import { Map } from 'immutable';

function* listSaga(action: any) {
    try {
        const credentials = yield select(state => state.getIn(['data', 'credentials']));
        let params = fromJS(action.payload || {});
        params = params.merge(credentials);

        const data = yield call(list, params.toJS());
        yield put(loadDataDone(data, action.meta));
    } catch (e) {
        // if we have error on list, 403 error, redirect to the login page
        yield put(loadDataDone(e, action.meta));
    }
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && action.meta === 'list', listSaga);
    yield takeLatest(
        (action: any) => action.type === 'SET_STATE' && action.meta === 'auth' && !action.error,
        function*() {
            yield put(loadData({}, 'list'));
        }
    );
    yield takeLatest(selectFile, function*(action) {
        // get all files from state
        let files: Map<String, any> = yield select(s => selectDataAtPath(s, ['selectedFiles'], Map<String, any>()));
        const { Key } = action.payload.file;
        if (files.has(Key)) {
            files = files.delete(Key);
        } else {
            files = files.set(Key, fromJS(action.payload.file));
        }
        yield put(setState(files, 'selectedFiles'));
    });
}
