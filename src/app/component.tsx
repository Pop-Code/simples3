import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Header, SecuredRoute } from '../components';
import { LoginView } from '../modules/Login';
import { ListView } from '../modules/List';
import { FileView } from '../modules/File';
import { createStyles, withStyles } from '@material-ui/core';

const styles = (theme: any) => {
    return createStyles({
        withToolbar: theme.mixins.toolbar,
        error404: {
            margin: theme.spacing.unit * 5
        }
    });
};

interface AppProps {
    classes: any;
    auth: any;
}

class App extends React.Component<AppProps> {
    render() {
        const { classes, auth } = this.props;
        return (
            <main>
                {auth && (
                    <>
                        <Header auth={auth} />
                        <div className={classes.withToolbar} />
                    </>
                )}
                <Switch>
                    <Route path="/login" component={LoginView} />
                    <SecuredRoute path="/list/:page?" redirectTo="/login" component={ListView} />
                    <SecuredRoute path="/file/:filename" redirectTo="/login" component={FileView} />
                    <Route render={() => <Redirect to="/login" />} />
                </Switch>
            </main>
        );
    }
}

export default withStyles(styles)(App);
