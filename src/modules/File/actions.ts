import { loadData } from '../Loader';
import { selectLoaderAtPath } from '../Loader';
import { Map } from 'immutable';

export const sanitizeFilename = (filename: string) => filename.replace(/\./g, '_');

export const view = (request: { filename: string; withContent?: boolean }) =>
    loadData(request, `view.${sanitizeFilename(request.filename)}`);

export const getData = (state: Map<any, any>, filename: string, paths?: string[], defaultValue?: any) => {
    let path = ['view', sanitizeFilename(filename)];
    if (paths) {
        path = path.concat(paths);
    }
    return selectLoaderAtPath(state, path, defaultValue);
};
