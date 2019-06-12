import React from 'react';
import Dropzone, { DropFilesEventHandler } from 'react-dropzone';
import { Typography, withStyles, createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        dropdown: {
            borderColor: theme.palette.grey[500],
            borderWidth: 1,
            borderStyle: 'dashed',
            padding: theme.spacing(5),
            borderRadius: theme.shape.borderRadius,
            textAlign: 'center',
            transition: theme.transitions.create('all', {
                delay: 200
            })
        },
        dropdownActive: {
            borderColor: theme.palette.secondary.light
        }
    });

export interface DropzoneFieldProps {
    children: React.ReactChildren;
    classes: any;
    onDrop: DropFilesEventHandler;
}

class DropzoneField extends React.Component<DropzoneFieldProps> {
    render() {
        return (
            <Dropzone onDrop={this.props.onDrop}>
                {(props: any) => {
                    const { getRootProps, getInputProps, isDragActive } = props;
                    return (
                        <div
                            {...getRootProps()}
                            className={`dropzone ${this.props.classes.dropdown}${
                                isDragActive ? ' ' + this.props.classes.dropdownActive : ''
                            }`}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <Typography color="secondary" variant="h6" component="p">
                                    Drop now to add files
                                </Typography>
                            ) : (
                                <Typography color="primary" variant="h6" component="p">
                                    Drop files here, or click to select files...
                                </Typography>
                            )}
                            {this.props.children}
                        </div>
                    );
                }}
            </Dropzone>
        );
    }
}

export default withStyles(styles)(DropzoneField);
