import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { getPageContext } from './context';
import { Provider } from 'react-redux';
import { createReduxStore, createHistory } from './store';
import { Store } from 'redux';
import { ConnectedRouter as Router } from 'connected-react-router/immutable';
import { getCredentials } from './modules/Login';
import { Map, fromJS } from 'immutable';
import { App } from './app';

export default class Client extends React.Component {
    private pageContext: any;
    private store: Store;
    private history: any;

    constructor(props: any) {
        super(props);
        this.pageContext = getPageContext();
        this.history = createHistory();

        const credentials = getCredentials();

        let state: Map<String, any> = Map();
        if (credentials) {
            state = state.setIn(['data', 'credentials'], fromJS(credentials.credentials));
            state = state.setIn(['data', 'auth'], fromJS(credentials.auth));
        }

        this.store = createReduxStore(this.history, state);
    }

    render() {
        return (
            <Provider store={this.store}>
                <ThemeProvider theme={this.pageContext.theme}>
                    <CssBaseline />
                    <Router history={this.history}>
                        <App />
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    }
}
