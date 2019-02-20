import { handleActions } from 'redux-actions';
import { fromJS, Map } from 'immutable';

export const defaultState = Map();

const metaCompat = (meta: string | string[]) => (Array.isArray(meta) ? meta : meta.split('.'));

export const reducer = handleActions(
    {
        RESET_DATA: (state: Map<any, any>, action: any) => {
            if (action.meta) {
                const path = metaCompat(action.meta);
                const newState = state.deleteIn(path);
                return newState;
            }
            return Map();
        },
        LOAD_DATA: (state: Map<any, any>, action: any) => {
            const path = metaCompat(action.meta);
            const newValue = fromJS({
                startTime: Date.now(),
                error: null,
                loading: true,
                request: fromJS(action.payload)
            });
            const newState = state.mergeIn(path, newValue);
            return newState;
        },
        LOAD_DATA_UPDATE: (state: Map<any, any>, action: any) => {
            const path = metaCompat(action.meta);
            const newState = state.mergeIn(path, action.payload);
            return newState;
        },
        LOAD_DATA_DONE: {
            next(state: Map<any, any>, action: any) {
                const path = metaCompat(action.meta);
                const endTime = Date.now();
                const duration = endTime - state.getIn([...path, 'startTime']);
                const newValue = fromJS({
                    endTime,
                    duration,
                    loading: false,
                    error: null,
                    data: action.payload
                });
                const newState = state.mergeIn(path, newValue);
                return newState;
            },
            throw(state: Map<any, any>, action: any) {
                const path = metaCompat(action.meta);
                const endTime = Date.now();
                const duration = endTime - state.getIn([...path, 'startTime']);
                const newValue = fromJS({
                    endTime,
                    duration,
                    loading: false,
                    error: fromJS({
                        message: action.payload.message
                    })
                });
                const newState = state.mergeIn(path, newValue);
                return newState;
            }
        }
    },
    defaultState
);
