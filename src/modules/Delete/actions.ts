import { loadData } from '../Loader';
import { setState, deleteState } from '../Data';
import { DeleteRequest } from '../../api';

export const deleteFiles = (request: DeleteRequest) => loadData(request, 'delete');

export const displayDeleteDialog = (display: boolean) =>
    display ? setState(true, 'showDeleteDialog') : deleteState('showDeleteDialog');
