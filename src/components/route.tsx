import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import withImmutablePropsToJS from './with-immutable';

interface SecuredRouteProps extends RouteProps {
    auth: any;
    redirectTo: string;
}

export class SecuredRoute extends Route<SecuredRouteProps> {
    render() {
        if (!this.props.auth) {
            return <Redirect to={this.props.redirectTo} />;
        }
        return super.render();
    }
}

export default connect((state: any) => ({
    auth: state.getIn(['data', 'credentials'])
}))(withImmutablePropsToJS(SecuredRoute));
