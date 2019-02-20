import { createActions } from 'redux-actions';

const actions = createActions({
    SET_STATE: [(data, meta) => data, (data, meta) => meta],
    DELETE_STATE: [meta => undefined, meta => meta]
});

export default actions;
export const setState = actions.setState;
export const deleteState = actions.deleteState;
