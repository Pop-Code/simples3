import React, { createRef, RefObject } from 'react';
import { reduxForm } from 'redux-form/immutable';
import { InjectedFormProps } from 'redux-form';
import { Typography } from '@material-ui/core';
import { UploadField } from '../../components';

export interface UploadFormProps extends InjectedFormProps {
    uploadItems: any[];
}

class UploadForm extends React.Component<UploadFormProps> {
    private form: RefObject<HTMLFormElement>;

    constructor(props: UploadFormProps) {
        super(props);
        this.form = createRef();
    }

    submit() {
        (this.form as any).submit();
    }

    render() {
        const { handleSubmit, error, uploadItems } = this.props;
        return (
            <form onSubmit={handleSubmit} ref={this.form} noValidate>
                {error && (
                    <Typography align="center" variant="body1" color="error">
                        {error}
                    </Typography>
                )}
                <UploadField name="files" uploadItems={uploadItems} />
            </form>
        );
    }
}

export default reduxForm<any, any>({ form: 'upload' })(UploadForm);
