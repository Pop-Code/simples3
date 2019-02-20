import React from 'react';
import { InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Field } from 'redux-form/immutable';

const renderSearchField = (props: any) => {
    const {
        label,
        input,
        meta: { touched, invalid, error },
        classes
    } = props;
    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <Search />
            </div>
            <InputBase
                placeholder={label}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput
                }}
                {...input}
            />
        </div>
    );
};

export default function ReduxSearchField(props: any) {
    return <Field {...props} />;
}
ReduxSearchField.defaultProps = {
    component: renderSearchField
};
