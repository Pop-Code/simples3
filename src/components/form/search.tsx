import React from 'react';
import SearchField from './searchfield';
import { reduxForm } from 'redux-form/immutable';
import { InjectedFormProps } from 'redux-form';
import { Typography } from '@material-ui/core';
import { any } from 'joi';

interface SearchFormProps {
    classes: any;
    label: string;
}

class SearchForm extends React.Component<SearchFormProps & InjectedFormProps> {
    private getForm() {
        return this.refs.form as any;
    }

    submit() {
        const form = this.getForm();
        if (form) {
            form.submit();
        }
    }

    render() {
        const { handleSubmit, error, classes, label } = this.props;
        return (
            <form onSubmit={handleSubmit} ref="form">
                {error && (
                    <Typography align="center" variant="body1" color="error">
                        {error}
                    </Typography>
                )}
                <SearchField name="search" label={label} classes={classes} />
            </form>
        );
    }
}

export default reduxForm<any, any>({
    form: 'search'
})(SearchForm);
