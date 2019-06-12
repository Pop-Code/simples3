import DeleteView from './component';
import { connect } from 'react-redux';
import { deleteFiles } from './actions';
import { withImmutablePropsToJS } from '../../components';
import { selectLoaderAtPath } from '../Loader';
import { selectDataAtPath } from '../Data';
import { AWSFileCollection, AWSFile } from '../File/types';

export default connect(
    (state: any) => ({
        error: selectLoaderAtPath<Error>(state, ['delete', 'error']),
        loading: selectLoaderAtPath<boolean>(state, ['delete', 'loading'], false),
        selectedFiles: selectDataAtPath<AWSFileCollection>(state, ['selectedFiles'], {})
    }),
    { delete: deleteFiles }
)(withImmutablePropsToJS(DeleteView));
