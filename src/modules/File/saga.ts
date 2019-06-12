import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getFile, getSignedUrl } from '../../api';
import { loadDataDone } from '../Loader';
import { fromJS } from 'immutable';

function* viewSaga(action: any) {
    try {
        const credentials = yield select(state => state.getIn(['data', 'credentials']));
        let params = fromJS(action.payload || {});
        params = params.merge(credentials);
        const request = params.toJS();
        const data = yield call(getFile, request);

        yield put(loadDataDone({ ...data, url: getSignedUrl(request) }, action.meta));
    } catch (e) {
        yield put(loadDataDone(e, action.meta));
    }
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && /^view\..+$/.test(action.meta), viewSaga);
}
