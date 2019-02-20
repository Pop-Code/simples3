import React from 'react';
import { TablePaginationActions } from '../../components';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import { UploadView } from '../Upload';
import { Add as AddIcon } from '@material-ui/icons';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TablePagination,
    Grid,
    Typography,
    LinearProgress,
    Fab,
    withStyles,
    createStyles
} from '@material-ui/core';

const styles = (theme: any) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing.unit * 5,
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing.unit * 3
            },
            paddingBottom: theme.spacing.unit * 11
        },
        table: {
            minWidth: 700
        },
        error: {
            width: '100%',
            backgroundColor: theme.palette.error.dark
        },
        fab: {
            margin: 0,
            top: 'auto',
            bottom: theme.spacing.unit * 2,
            right: theme.spacing.unit * 2,
            position: 'fixed'
        },
        loading: {
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0
        }
    });

interface ListViewProps {
    classes: any;
    push: any;
    list: (request: any) => void;
    displayUploadDialog: (show: boolean) => void;
    showUploadDialog: boolean;
    page: number;
    countPerPage: number;
    loading: boolean;
    count: number;
    data: any[];
    error?: any;
    search?: string;
}

class ListView extends React.Component<ListViewProps> {
    state: any = {
        search: null,
        countPerPage: 0
    };

    constructor(props: ListViewProps) {
        super(props);
        this.handleReload = this.handleReload.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.state.countPerPage = this.props.countPerPage;
        this.state.search = this.props.search;
    }

    handleChangeRowsPerPage(e: any) {
        this.setState({
            countPerPage: parseInt(e.target.value, 10)
        });
        this.props.push(this.createPathname(0));
    }

    handlePageChange(e: any, page: number) {
        this.props.push(this.createPathname(page));
    }

    handleReload(e: any) {
        this.props.list({});
    }

    createPathname(page: number = 0) {
        return `/list${page ? '/' + page : ''}`;
    }

    componentDidUpdate() {
        const { search } = this.props;
        if (search !== this.state.search) {
            this.setState({ search: search === '' ? undefined : search });
        }
    }

    private applyFilters(data: any[]) {
        if (!this.state.search) {
            return data;
        }
        return data.filter((file: any) =>
            new RegExp('^' + this.state.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(file.Key)
        );
    }

    render() {
        const { classes, page, data, error, count, loading, displayUploadDialog, showUploadDialog } = this.props;
        const { countPerPage } = this.state;
        const filteredData = this.applyFilters(data);
        const filteredCount = filteredData.length;

        return (
            <>
                {loading && <LinearProgress className={classes.loading} variant="indeterminate" color="secondary" />}
                <div className={classes.root}>
                    <Grid container spacing={24} justify="center">
                        <Grid item xs={12}>
                            {error && (
                                <Typography variant="body1" color="error">
                                    {error.message}
                                </Typography>
                            )}
                            {data && (
                                <Paper>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Filename</TableCell>
                                                <TableCell>Last Modified</TableCell>
                                                <TableCell>Size</TableCell>
                                                <TableCell>Storage Class</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredData
                                                .slice(page * countPerPage, page * countPerPage + countPerPage)
                                                .map((file: any) => (
                                                    <TableRow
                                                        hover
                                                        key={file.Key}
                                                        onClick={() => this.props.push(`/file/${file.Key}`)}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {file.Key}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {moment(file.LastModified).format('LLL')}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {prettyBytes(file.Size)}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {file.StorageClass}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
                                                    colSpan={4}
                                                    count={filteredCount}
                                                    rowsPerPage={countPerPage}
                                                    page={page}
                                                    SelectProps={{ native: true }}
                                                    onChangePage={this.handlePageChange}
                                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                    ActionsComponent={(props: any) => (
                                                        <TablePaginationActions
                                                            {...props}
                                                            onReload={this.handleReload}
                                                        />
                                                    )}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                </div>
                <Fab className={classes.fab} color="secondary" onClick={() => displayUploadDialog(true)}>
                    <AddIcon />
                </Fab>
                <UploadView open={showUploadDialog} onClose={() => displayUploadDialog(false)} />
            </>
        );
    }
}

export default withStyles(styles)(ListView);
