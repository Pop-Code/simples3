import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    withStyles,
    createStyles,
    Theme,
    LinearProgress
} from '@material-ui/core';
import { AWSFile } from '../File/types';
import { DeleteRequest } from '../../api';

const styles = (theme: Theme) => createStyles({});

export interface DeleteViewProps {
    selectedFiles: { [key: string]: AWSFile };
    loading: boolean;
    open: boolean;
    error?: Error;
    delete: (request: DeleteRequest) => void;
    onClose: () => void;
}

class DeleteView extends React.Component<DeleteViewProps> {
    constructor(props: DeleteViewProps) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    static defaultProps: Partial<DeleteViewProps> = {
        open: false
    };

    delete() {
        this.props.delete({ files: Object.keys(this.props.selectedFiles) });
    }

    render() {
        const { open, onClose, selectedFiles, error } = this.props;
        const selectedFilesKeys = Object.keys(selectedFiles);
        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete</DialogTitle>
                <DialogContent>
                    <Typography paragraph>
                        You are about to delete {selectedFilesKeys.length} file(s), would you like to continue?
                    </Typography>
                    {error && <Typography color="error">{error.message}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={this.delete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(DeleteView);
