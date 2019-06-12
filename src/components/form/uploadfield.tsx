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
import moment from 'moment';

const progressPercent = (loaded: number, total: number) => {
    return Math.round((loaded * 100) / total);
};

const UploadProgress = (props: any) => {
    return (
        <LinearProgress
            variant="determinate"
            color="secondary"
            value={props.progress ? progressPercent(props.progress.loaded, props.progress.total) : 0}
            style={{
                marginTop: 5,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 15
            }}
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
                        const loaderDuration = _.get(loaderState, 'duration', null);
                        let secondaryText = '';
                        let secondaryTypographyProps = {};
                        if (!loaderError && loaderDuration && !loaderLoading) {
                            secondaryText = `Done in ${moment.duration(loaderDuration, 'ms').asSeconds()}s`;
                            secondaryTypographyProps = { color: 'primary' };
                        }
                        if (loaderError) {
                            secondaryText = loaderError;
                            secondaryTypographyProps = { color: 'error' };
                        }
                        return (
                            <div key={a.name}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FileIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={a.name}
                                        secondary={secondaryText}
                                        secondaryTypographyProps={secondaryTypographyProps}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            aria-label="Delete"
                                            onClick={() => input.onChange(input.value.deleteIn(['accepted', index]))}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
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
