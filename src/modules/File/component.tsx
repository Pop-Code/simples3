import React from 'react';
import { Theme, LinearProgress, Grid, Paper, Typography, Fab, withStyles, createStyles } from '@material-ui/core';
import { CloudDownload as DownloadIcon } from '@material-ui/icons';
import prettyBytes from 'pretty-bytes';
import moment from 'moment';
import { AWSFile } from './types';
import { getSignedUrl, GetRequest } from '../../api';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing(5),
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(3)
            }
        },
        paper: {
            ...theme.mixins.gutters(),
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3)
        },
        fab: {
            margin: 0,
            top: 'auto',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            position: 'fixed'
        },
        loading: {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0
        }
    });

export interface FileViewProps {
    filename: string;
    data: AWSFile;
    error: any;
    loading: boolean;
    classes: any;
    view: (request: GetRequest) => void;
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
                {loading && <LinearProgress className={classes.loading} variant="indeterminate" color="secondary" />}
                <div className={classes.root}>
                    <Grid container spacing={3}>
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
                                                Size: {data.ContentLength ? prettyBytes(data.ContentLength) : 'Unknow'}
                                            </Typography>
                                            <Typography component="p">
                                                Type: {data.ContentType ? data.ContentType : 'Unknow'}
                                            </Typography>
                                            <Typography component="p">
                                                Last modified:{' '}
                                                {data.LastModified
                                                    ? moment(data.LastModified).format('LLLL')
                                                    : 'Unknow'}
                                            </Typography>
                                        </Paper>
                                    </Typography>
                                </Grid>
                                {data.Metadata && (
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
                                    onClick={() => {
                                        if (data.url) window.location.href = data.url;
                                    }}
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
