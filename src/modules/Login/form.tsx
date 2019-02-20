import React, { createRef, RefObject } from 'react';
import { reduxForm } from 'redux-form/immutable';
import { InjectedFormProps } from 'redux-form';
import { Typography } from '@material-ui/core';
import { TextField } from '../../components';

class LoginForm extends React.Component<InjectedFormProps> {
    form: RefObject<HTMLFormElement>;

    constructor(props: InjectedFormProps) {
        super(props);
        this.form = createRef();
    }

    submit() {
        (this.form as any).submit();
    }

    render() {
        const { handleSubmit, error } = this.props;
        return (
            <form onSubmit={handleSubmit} ref={this.form} noValidate>
                {error && (
                    <Typography align="center" variant="body1" color="error">
                        {error}
                    </Typography>
                )}
                <TextField name="accessKeyId" label="Access Key Id" fullWidth margin="normal" />
                <TextField
                    name="secretAccessKey"
                    label="Secret Access Key"
                    type="password"
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField name="region" label="Region" fullWidth margin="normal" required />
                <TextField name="bucketName" label="Bucket" fullWidth margin="normal" />
            </form>
        );
    }
}

export default reduxForm({
    form: 'login'
})(LoginForm);
