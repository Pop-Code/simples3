import ListView from './component';
import { list } from './actions';
import { connect } from 'react-redux';
import { selectLoaderAtPath } from '../Loader';
import { displayUploadDialog } from '../Upload';
import { withImmutablePropsToJS } from '../../components';
import { push } from 'connected-react-router';
import _ from 'lodash';

export default connect(
    (state: any, props: any) => ({
        search: state.getIn(['form', 'search', 'values', 'search']),
        page: parseInt(_.get(props, 'match.params.page', 0), 10),
        countPerPage: 10,
        data: selectLoaderAtPath(state, ['list', 'data', 'data'], []),
        count: selectLoaderAtPath(state, ['list', 'data', 'count'], 0),
        error: selectLoaderAtPath(state, ['list', 'error'], null),
        loading: selectLoaderAtPath(state, ['list', 'loading'], false),
        showUploadDialog: state.getIn(['data', 'showUploadDialog']) || false
    }),
    { list, push, displayUploadDialog }
)(withImmutablePropsToJS(ListView));
