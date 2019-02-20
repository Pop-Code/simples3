import React from 'react';
import { Theme, LinearProgress, Grid, Paper, Typography, Fab, withStyles, createStyles } from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import prettyBytes from 'pretty-bytes';
import moment from 'moment';
import _ from 'lodash';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
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
        fab: {
            margin: 0,
            top: 'auto',
            bottom: theme.spacing.unit * 2,
            right: theme.spacing.unit * 2,
            position: 'fixed'
        }
    });

export interface FileViewProps {
    filename: string;
    data: any;
    error: any;
    loading: boolean;
    classes: any;
    view: (request: any) => void;
}

export class FileView extends React.Component<FileViewProps> {
    componentDidMount() {
        const { filename, view } = this.props;
        view({ filename });
    }

    render() {
        const { filename, loading, classes, error, data, view } = this.props;
        return (
            <>
                {loading && <LinearProgress variant="indeterminate" color="secondary" />}
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        {error && (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="error">
                                    {error.message}
                                </Typography>
                            </Grid>
                        )}
                        {data && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h5" component="h2" color="primary">
                                        <Paper className={classes.paper}>
                                            <Typography variant="h5" component="h3">
                                                File Infos
                                            </Typography>
                                            <Typography component="p">Name: {filename}</Typography>
                                            <Typography component="p">
                                                Size:{' '}
                                                {_.has(data, 'ContentLength')
                                                    ? prettyBytes(data.ContentLength)
                                                    : 'Unknow'}
                                            </Typography>
                                            <Typography component="p">
                                                Type: {_.get(data, 'ContentType', 'Unknow')}
                                            </Typography>
                                            <Typography component="p">
                                                Last modified:{' '}
                                                {_.has(data, 'LastModified')
                                                    ? moment(data.LastModified).format('LLLL')
                                                    : 'Unknow'}
                                            </Typography>
                                        </Paper>
                                    </Typography>
                                </Grid>
                                {_.has(data, 'Metadata') && (
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" component="h2" color="primary">
                                            <Paper className={classes.paper}>
                                                <Typography variant="h5" component="h3">
                                                    Metadata
                                                </Typography>
                                                {Object.keys(data.Metadata).length === 0 && (
                                                    <Typography component="p">No metadata.</Typography>
                                                )}
                                            </Paper>
                                        </Typography>
                                    </Grid>
                                )}
                                <Fab
                                    className={classes.fab}
                                    color="secondary"
                                    onClick={() => view({ filename, download: true })}
                                >
                                    <DownloadIcon />
                                </Fab>
                            </>
                        )}
                    </Grid>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(FileView);
