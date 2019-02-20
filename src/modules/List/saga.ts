import { takeLatest, call, put, select } from 'redux-saga/effects';
import { list } from '../../api';
import { loadData, loadDataDone } from '../Loader';
import { fromJS } from 'immutable';

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
}
