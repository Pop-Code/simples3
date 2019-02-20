import { handleActions } from 'redux-actions';
import { Map, fromJS } from 'immutable';

const metaCompat = (metas: string | string[]) =>
    (Array.isArray(metas) ? metas : metas.split('.')).map((meta: any) => {
        if (isNaN(meta)) {
            return meta;
        } else {
            return parseInt(meta, 10);
        }
    });

const defaultState = Map();

export const reducer = handleActions(
    {
        SET_STATE: (state: Map<any, any>, action: any) => {
            const newValue = fromJS(action.payload);
            const newState = state.setIn(metaCompat(action.meta), newValue);
            return newState;
        },
        DELETE_STATE: (state: Map<any, any>, action: any) => {
            const newState = state.deleteIn(metaCompat(action.meta));
            return newState;
        }
    },
    defaultState
);
