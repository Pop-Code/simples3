import UploadView from './component';
import { connect } from 'react-redux';
import { upload } from './actions';
import { withImmutablePropsToJS } from '../../components';
import { selectLoaderAtPath } from '../Loader';

export default connect(
    (state: any) => ({
        acceptedFiles: state.getIn(['form', 'upload', 'values', 'files', 'accepted']) || [],
        rejectedFiles: state.getIn(['form', 'upload', 'values', 'files', 'rejected']) || [],
        uploadItems: selectLoaderAtPath(state, ['upload', 'items'], [])
    }),
    { upload }
)(withImmutablePropsToJS(UploadView));
