import { createActions } from 'redux-actions';
import { Map } from 'immutable';

const actions = createActions({
    RESET_DATA: [meta => undefined, meta => (meta ? meta : null)],
    LOAD_DATA: [data => data, (data, meta) => (meta ? meta : null)],
    LOAD_DATA_UPDATE: [data => data, (data, meta) => (meta ? meta : null)],
    LOAD_DATA_DONE: [data => data, (data, meta) => (meta ? meta : null)]
});

export const { loadData, loadDataUpdate, loadDataDone, resetData } = actions;

export const selectLoaderAtPath = <T = any>(state: Map<any, any>, paths: string[], defaultValue?: T): T => {
    const data = state.getIn(['loader', ...paths]);
    if (!data && defaultValue) {
        return defaultValue;
    }
    return data;
};
