import { push } from 'connected-react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withImmutablePropsToJS } from '../../components';
import { selectDataAtPath } from '../Data';
import { selectLoaderAtPath } from '../Loader';
import { displayUploadDialog } from '../Upload';
import { displayDeleteDialog } from '../Delete';
import { list, selectFile } from './actions';
import { AWSFile, AWSFileCollection } from '../File/types';
import ListView from './component';

export default connect(
    (state: any, props: any) => ({
        search: state.getIn(['form', 'search', 'values', 'search']),
        page: parseInt(_.get(props, 'match.params.page', 0), 10),
        countPerPage: 10,
        data: selectLoaderAtPath<AWSFile[]>(state, ['list', 'data', 'data'], []),
        count: selectLoaderAtPath<number>(state, ['list', 'data', 'count'], 0),
        error: selectLoaderAtPath<Error | null>(state, ['list', 'error'], null),
        loading: selectLoaderAtPath<boolean>(
            state,
            ['list', 'loading'],
            selectLoaderAtPath<boolean>(state, ['delete', 'loading'], false)
        ),
        selectedFiles: selectDataAtPath<AWSFileCollection>(state, ['selectedFiles'], {}),
        showUploadDialog: selectDataAtPath<boolean>(state, ['showUploadDialog'], false),
        showDeleteDialog: selectDataAtPath<boolean>(state, ['showDeleteDialog'], false)
    }),
    { list, push, displayUploadDialog, displayDeleteDialog, selectFile }
)(withImmutablePropsToJS(ListView));
