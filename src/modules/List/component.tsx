import {
    Breadcrumbs,
    Checkbox,
    createStyles,
    Fab,
    Grid,
    IconButton,
    LinearProgress,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    withStyles
} from '@material-ui/core';
import { Add as AddIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { Map } from 'immutable';
import moment from 'moment';
import prettyBytes from 'pretty-bytes';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TablePaginationActions } from '../../components';
import { DeleteView } from '../Delete';
import { UploadView } from '../Upload';

const styles = (theme: any) =>
    createStyles({
        root: {
            flexGrow: 1,
            padding: theme.spacing(5),
            [theme.breakpoints.down('sm')]: {
                padding: theme.spacing(3)
            },
            paddingBottom: theme.spacing(11)
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

interface ListViewProps {
    classes: any;
    push: any;
    list: (request: any) => void;
    displayUploadDialog: (show: boolean) => void;
    displayDeleteDialog: (show: boolean) => void;
    selectFile: (file: any) => void;
    selectedFiles: Map<String, any>;
    showUploadDialog: boolean;
    showDeleteDialog: boolean;
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

    componentDidMount() {
        if (this.props.data.length === 0) {
            this.props.list({});
        }
    }

    private applyFilters(data: any[]) {
        if (!this.state.search) {
            return data;
        }
        return data.filter((file: any) =>
            new RegExp(this.state.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(file.Key)
        );
    }

    render() {
        const {
            classes,
            page,
            data,
            error,
            loading,
            displayUploadDialog,
            displayDeleteDialog,
            showUploadDialog,
            showDeleteDialog,
            selectFile,
            selectedFiles
        } = this.props;
        const { countPerPage } = this.state;
        const filteredData = this.applyFilters(data);
        const filteredCount = filteredData.length;
        const selectedFileKeys = Object.keys(selectedFiles);
        return (
            <>
                {loading && <LinearProgress className={classes.loading} variant="indeterminate" color="secondary" />}
                <div className={classes.root}>
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12}>
                            {data && (
                                <Paper>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox" />
                                                <TableCell>Filename</TableCell>
                                                <TableCell>Last Modified</TableCell>
                                                <TableCell>Size</TableCell>
                                                <TableCell>Storage Class</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredData.length === 0 && !error && (
                                                <TableRow>
                                                    <TableCell colSpan={5}>
                                                        <Typography align="center" color="primary">
                                                            No item.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {error && (
                                                <TableRow>
                                                    <TableCell colSpan={5}>
                                                        <Typography align="center" color="error">
                                                            {error.message}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {filteredData
                                                .slice(page * countPerPage, page * countPerPage + countPerPage)
                                                .map((file: any) => {
                                                    const isChecked = selectedFileKeys.indexOf(file.Key) > -1;
                                                    return (
                                                        <TableRow hover key={file.Key}>
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    onChange={ee => selectFile({ file })}
                                                                    inputProps={{ 'aria-label': `Select ${file.Key}` }}
                                                                />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row">
                                                                <Link component={RouterLink} to={`/file/${file.Key}`}>
                                                                    {file.Key}
                                                                </Link>
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
                                                    );
                                                })}
                                        </TableBody>
                                        {data.length > 0 && (
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        colSpan={4}
                                                        rowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
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
                                                    <TableCell>
                                                        {selectedFileKeys.length > 0 && (
                                                            <IconButton
                                                                aria-label="Delete"
                                                                onClick={() => displayDeleteDialog(true)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TableFooter>
                                        )}
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
                <DeleteView open={showDeleteDialog} onClose={() => displayDeleteDialog(false)} />
            </>
        );
    }
}

export default withStyles(styles)(ListView);
