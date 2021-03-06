import { fork } from 'redux-saga/effects';
import { LoginSaga } from './modules/Login';
import { ListSaga } from './modules/List';
import { FileSaga } from './modules/File';
import { UploadSaga } from './modules/Upload';
import { DeleteSaga } from './modules/Delete';

export function* saga() {
    yield fork(LoginSaga);
    yield fork(ListSaga);
    yield fork(FileSaga);
    yield fork(UploadSaga);
    yield fork(DeleteSaga);
}
