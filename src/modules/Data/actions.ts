import { createActions } from 'redux-actions';
import { Map } from 'immutable';

const actions = createActions({
    SET_STATE: [(data, meta) => data, (data, meta) => meta],
    DELETE_STATE: [meta => undefined, meta => meta]
});

export default actions;
export const setState = actions.setState;
export const deleteState = actions.deleteState;

export const selectDataAtPath = <T = any>(state: Map<any, any>, paths: string[], defaultValue?: T): T => {
    const data = state.getIn(['data', ...paths]);
    if (!data && defaultValue) {
        return defaultValue;
    }
    return data;
};
