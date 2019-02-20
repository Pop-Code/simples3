import React, { createRef, RefObject } from 'react';
import UploadForm from './form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    withStyles,
    createStyles,
    Theme
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({});

export interface UploadViewProps {
    uploadItems: any[];
    open: boolean;
    upload: (request: any) => void;
    onClose: () => void;
}

class UploadView extends React.Component<UploadViewProps> {
    uploadForm: RefObject<any>;

    constructor(props: UploadViewProps) {
        super(props);
        this.uploadForm = createRef();
        this.upload = this.upload.bind(this);
    }

    upload(values: any) {
        this.props.upload({
            files: values.getIn(['files', 'accepted']).toJS()
        });
    }

    render() {
        const { open, onClose, uploadItems } = this.props;
        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload</DialogTitle>
                <DialogContent>
                    <UploadForm ref={this.uploadForm} onSubmit={this.upload} uploadItems={uploadItems} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.uploadForm.current.submit()} color="secondary">
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(UploadView);
