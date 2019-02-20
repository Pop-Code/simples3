import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import RefreshIcon from '@material-ui/icons/Refresh';

interface TablePaginationProps {
    classes: any;
    count: number;
    page: number;
    rowsPerPage: number;
    theme: any;
    onChangePage: (e: any, page: number) => void;
    onReload?: (e: any) => void;
}

const actionsStyles = (theme: any) =>
    createStyles({
        root: {
            flexShrink: 0,
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing.unit * 2.5
        }
    });

class TablePaginationActions extends React.Component<TablePaginationProps> {
    handleFirstPageButtonClick(event: any) {
        this.props.onChangePage(event, 0);
    }

    handleBackButtonClick(event: any) {
        this.props.onChangePage(event, this.props.page - 1);
    }

    handleNextButtonClick(event: any) {
        this.props.onChangePage(event, this.props.page + 1);
    }

    handleLastPageButtonClick(event: any) {
        this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
    }

    handleReload(event: any) {
        if (this.props.onReload) {
            this.props.onReload(event);
        }
    }

    constructor(props: TablePaginationProps) {
        super(props);
        this.handleFirstPageButtonClick = this.handleFirstPageButtonClick.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
        this.handleLastPageButtonClick = this.handleLastPageButtonClick.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }

    render() {
        const { classes, count, page, rowsPerPage, theme, onReload } = this.props;

        return (
            <div className={classes.root}>
                {onReload && (
                    <IconButton color="secondary" onClick={this.handleReload} aria-label="Reload">
                        <RefreshIcon />
                    </IconButton>
                )}
                <IconButton
                    color="secondary"
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    color="secondary"
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    color="secondary"
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    color="secondary"
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}

export default withStyles(actionsStyles, {
    withTheme: true
})(TablePaginationActions);
