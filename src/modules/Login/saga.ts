import { takeLatest, call, put, all, select } from 'redux-saga/effects';
import { loadDataDone, resetData } from '../Loader';
import { setState, deleteState } from '../Data';
import { stopSubmit } from 'redux-form/immutable';
import { ValidationError } from 'joi';
import { push } from 'connected-react-router';
import { setCredentials, clearCredentials } from './storage';
import { login } from './actions';
import { login as loginApi } from '../../api';

function* loginSaga(action: any) {
    try {
        const data = yield call(loginApi, action.payload.credentials);
        yield put(setState(action.payload.credentials, 'credentials'));
        yield put(loadDataDone(data, action.meta));
        yield put(setState(data, 'auth'));
        setCredentials({ credentials: action.payload.credentials, auth: data });
        if (action.payload.redirectAfter) {
            yield put(push(action.payload.redirectAfter));
        }
    } catch (e) {
        // if we are not on the login page, but an error occurs during login, redirect to the login page first
        const location = yield select(state => state.get('router').location);
        if (!/^\/login/g.test(location.pathname)) {
            yield put(push('/login'));
        }

        if (e.name === 'ValidationError') {
            const errors = (e as ValidationError).details.reduce((errs: any, err: any) => {
                const prop = err.path[0];
                if (typeof (errs[prop] as any) === 'undefined') {
                    errs[prop] = err.message;
                } else {
                    errs[prop] += ', ' + err.message;
                }
                return errs;
            }, {});
            yield put(stopSubmit(action.meta, errors));
        } else {
            yield put(stopSubmit(action.meta, { _error: e.message }));
        }
        yield put(loadDataDone(e, action.meta));
    }
}

function* logoutSaga() {
    if (typeof window !== 'undefined') {
        clearCredentials();
    }
    yield all([put(resetData()), put(deleteState('auth')), put(deleteState('credentials'))]);
}

export default function* saga() {
    yield takeLatest((action: any) => action.type === 'LOAD_DATA' && action.meta === 'login', loginSaga);

    // init
    const location = yield select(state => state.get('router').location);
    const credentials = yield select(state => state.getIn(['data', 'credentials']));
    const auth = yield select(state => state.getIn(['data', 'auth']));

    if (credentials && auth && !/^\/list/g.test(location.pathname)) {
        yield put(push('/list'));
    } else if ((!credentials || !auth) && !/^\/login/g.test(location.pathname)) {
        yield put(push('/login'));
    }

    yield takeLatest((action: any) => action.type === 'LOGOUT', logoutSaga);
}
