import React from 'react';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
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
        this.store = createReduxStore(
            this.history,
            credentials ? Map().setIn(['data', 'credentials'], fromJS(credentials)) : undefined
        );
    }

    render() {
        return (
            <Provider store={this.store}>
                <MuiThemeProvider theme={this.pageContext.theme}>
                    <CssBaseline />
                    <Router history={this.history}>
                        <App />
                    </Router>
                </MuiThemeProvider>
            </Provider>
        );
    }
}
