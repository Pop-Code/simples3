import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getFile } from '../../api';
import { loadDataDone } from '../Loader';
import { fromJS } from 'immutable';
import FileSaver from 'file-saver';

function* viewSaga(action: any) {
    try {
        const credentials = yield select(state => state.getIn(['data', 'credentials']));
        let params = fromJS(action.payload || {});
        params = params.merge(credentials);
        const data = yield call(getFile, params.toJS());

        // download the file, replace the response, but remove the content.
        if (params.get('download')) {
            const blob = new Blob([data.Body], { type: data.ContentType });
            FileSaver.saveAs(blob, params.get('filename'));
            // delete the content
            delete data.Body;
        }
        yield put(loadDataDone(data, action.meta));
    } catch (e) {
        yield put(loadDataDone(e, action.meta));
    }
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && /^view\..+$/.test(action.meta), viewSaga);
}
