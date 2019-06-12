import { loadData } from '../Loader';
import { APIRequest, BucketSelector } from '../../api';

export interface LoginRequest {
    credentials: APIRequest & BucketSelector;
    redirectAfter?: string;
}

export const login = (request: LoginRequest) => loadData(request, 'login');

export const logout = () => ({ type: 'LOGOUT' });
