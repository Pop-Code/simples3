import React from 'react';
import Dropzone from './dropzone';
import { Field } from 'redux-form/immutable';
import { InsertDriveFile as FileIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { fromJS } from 'immutable';
import _ from 'lodash';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    IconButton,
    Typography,
    LinearProgress
} from '@material-ui/core';

const progressPercent = (loaded: number, total: number) => {
    console.log(Math.round((loaded * 100) / total));
    return Math.round((loaded * 100) / total);
};

const UploadProgress = (props: any) => {
    return (
        <LinearProgress
            variant="determinate"
            color="secondary"
            value={props.progress ? progressPercent(props.progress.loaded, props.progress.total) : 0}
        />
    );
};

const renderUploadField = (props: any) => {
    const {
        label,
        input,
        meta: { touched, invalid, error },
        uploadItems,
        ...custom
    } = props;

    return (
        <div>
            {error && touched && invalid && (
                <Typography align="center" variant="body1" color="error">
                    {error}
                </Typography>
            )}
            <Dropzone onDrop={(accepted, rejected) => input.onChange(fromJS({ accepted, rejected }))} {...custom} />
            <List dense>
                {typeof input.value === 'object' &&
                    input.value.get('accepted').map((a: File, index: number) => {
                        const loaderState = _.get(uploadItems, index, null);
                        const loaderLoading = _.get(loaderState, 'loading', false);
                        const loaderError = _.get(loaderState, 'error.message', null);
                        return (
                            <div key={a.name}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FileIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={a.name} />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            aria-label="Delete"
                                            onClick={() => input.onChange(input.value.deleteIn(['accepted', index]))}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {loaderError && <Typography color="error">{loaderError}</Typography>}
                                {loaderLoading && <UploadProgress progress={loaderState.progress} />}
                            </div>
                        );
                    })}
            </List>
        </div>
    );
};

export default function ReduxUploadField(props: any) {
    return <Field {...props} />;
}

ReduxUploadField.defaultProps = {
    component: renderUploadField
};
