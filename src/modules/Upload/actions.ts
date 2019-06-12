import { loadData } from '../Loader';
import { setState, deleteState } from '../Data';

export const upload = (request: { files: File[] }) => loadData(request, 'upload');

export const displayUploadDialog = (display: boolean) =>
    display ? setState(true, 'showUploadDialog') : deleteState('showUploadDialog');
