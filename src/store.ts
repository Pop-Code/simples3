import { createStore, applyMiddleware, compose } from 'redux';
import { reducer as form } from 'redux-form/immutable';
import { reducer as loader } from './modules/Loader';
import { reducer as data } from './modules/Data';
import { History, createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { saga } from './sagas';
import { combineReducers } from 'redux-immutable';
import Immutable, { Map } from 'immutable';
import createSagaMiddleware from 'redux-saga';

const composeEnhancers =
    typeof window !== 'undefined' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              serialize: { immutable: Immutable }
          })
        : compose;

const immutableState = Map();

const createRootReducer = (history: History, initialState: Map<any, any>) => {
    console.log('INIT', initialState);
    return combineReducers(
        {
            router: connectRouter(history),
            form,
            loader,
            data
        } as any,
        () => initialState
    );
};
export function createHistory(): History {
    return createBrowserHistory();
}

export function createReduxStore(history: History, initialState = immutableState) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        createRootReducer(history, initialState),
        composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))
    );

    sagaMiddleware.run(saga);

    return store;
}
