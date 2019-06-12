import App from './component';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import withImmutablePropsToJS from '../components/with-immutable';

export default withRouter(connect((state: any) => ({
    auth: state.getIn(['data', 'auth']),
    location: state.get('router').location
}))(withImmutablePropsToJS(App)) as any);
