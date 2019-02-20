import LoginView from './component';
import { connect } from 'react-redux';
import { login, logout } from './actions';
import { withImmutablePropsToJS } from '../../components';
import { selectLoaderAtPath } from '../Loader';

export default connect(
    (state: any) => ({
        loading: selectLoaderAtPath(state, ['login', 'loading'], false)
    }),
    { login, logout }
)(withImmutablePropsToJS(LoginView));
