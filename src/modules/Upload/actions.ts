import { loadData } from '../Loader';
import { setState, deleteState } from '../Data';

export const upload = (request: {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        region?: string;
        bucketName?: string;
    };
    files: File[];
}) => loadData(request, 'upload');

export const displayUploadDialog = (display: boolean) =>
    display ? setState(true, 'showUploadDialog') : deleteState('showUploadDialog');
