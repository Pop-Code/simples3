import { loadData } from '../Loader';
import { createAction } from 'redux-actions';
import { ListRequest } from '../../api';

export const list = (request?: ListRequest) => loadData(request, 'list');

export const selectFile = createAction('selectFile');
