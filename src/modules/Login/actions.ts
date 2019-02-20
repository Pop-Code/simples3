import { loadData } from '../Loader';

export const login = (request: {
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        region?: string;
        bucketName?: string;
    };
    redirectAfter?: string;
}) => loadData(request, 'login');

export const logout = () => ({ type: 'LOGOUT' });
