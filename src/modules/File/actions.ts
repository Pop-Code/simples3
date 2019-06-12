import { loadData } from '../Loader';
import { selectLoaderAtPath } from '../Loader';
import { Map } from 'immutable';
import { GetRequest } from '../../api';

export const sanitizeFilename = (filename: string) => filename.replace(/\./g, '_');

export const view = (request: GetRequest) => loadData(request, `view.${sanitizeFilename(request.filename)}`);

export const getData = <T = any>(
    state: Map<any, any>,
    filename: string,
    paths?: string[],
    defaultValue?: T | undefined
): T => {
    let path = ['view', sanitizeFilename(filename)];
    if (paths) {
        path = path.concat(paths);
    }
    return selectLoaderAtPath<T>(state, path, defaultValue);
};
