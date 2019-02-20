import React from 'react';
import { TextField } from '@material-ui/core';
import { Field } from 'redux-form/immutable';

const renderTextField = (props: any) => {
    const {
        label,
        input,
        meta: { touched, invalid, error },
        ...custom
    } = props;
    return (
        <TextField
            label={label}
            placeholder={label}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />
    );
};

export default function ReduxTextField(props: any) {
    return <Field {...props} />;
}
ReduxTextField.defaultProps = {
    component: renderTextField
};
