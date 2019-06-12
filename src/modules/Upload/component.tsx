import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Theme,
    withStyles
} from '@material-ui/core';
import React, { createRef, RefObject } from 'react';
import UploadForm from './form';

const styles = (theme: Theme) => createStyles({});

export interface UploadViewProps {
    acceptedFiles: any[];
    uploadItems: any[];
    open: boolean;
    upload: (request: { files: File[] }) => void;
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

    static defaultProps: Partial<UploadViewProps> = {
        open: false
    };

    render() {
        const { open, onClose, uploadItems, acceptedFiles } = this.props;
        return (
            <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Upload</DialogTitle>
                <DialogContent>
                    <UploadForm ref={this.uploadForm} onSubmit={this.upload} uploadItems={uploadItems} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                    {acceptedFiles.length > 0 && (
                        <Button onClick={() => this.uploadForm.current.submit()} color="secondary">
                            Upload
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(UploadView);
