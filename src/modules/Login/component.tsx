import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from './form';
import { Grid, Paper, Button, Typography, LinearProgress, Theme, createStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.primary.main,
            height: '100%'
        },
        grid: {
            minHeight: '100vh',
            padding: theme.spacing.unit * 5,
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing.unit * 3
            }
        },
        paper: {
            ...theme.mixins.gutters(),
            paddingTop: theme.spacing.unit * 3,
            paddingBottom: theme.spacing.unit * 3
        },
        button: {
            marginTop: theme.spacing.unit * 3
        },
        loading: {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0
        }
    });

interface LoginViewProps {
    classes: any;
    login: (request: any) => void;
    logout: () => void;
    loading: boolean;
}

class LoginView extends React.Component<LoginViewProps> {
    constructor(props: LoginViewProps) {
        super(props);
        this.login = this.login.bind(this);
    }

    static propTypes = {
        classes: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    };

    login(credentials: any) {
        this.props.login({
            credentials: credentials.toJS(),
            redirectAfter: '/list'
        });
    }

    componentDidMount() {
        this.props.logout();
    }

    render() {
        const { classes, loading } = this.props;
        return (
            <>
                {loading && <LinearProgress className={classes.loading} variant="indeterminate" color="secondary" />}
                <div className={classes.root}>
                    <Grid
                        className={classes.grid}
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={12} sm={8} md={6} lg={4}>
                            <Paper className={classes.paper}>
                                <Typography align="center" variant="h5" component="h2" gutterBottom>
                                    SIGN IN
                                </Typography>
                                <LoginForm
                                    ref="loginForm"
                                    onSubmit={this.login}
                                    initialValues={{
                                        region: 'eu-west-3',
                                        bucketName: 'export-aquarelle'
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.button}
                                    onClick={() => (this.refs.loginForm as any).submit()}
                                >
                                    Sign In
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(LoginView);
