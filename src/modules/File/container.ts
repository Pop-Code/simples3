import { connect } from 'react-redux';
import FileView, { FileViewProps } from './component';
import { view, getData } from './actions';
import { withImmutablePropsToJS } from '../../components';
import { AWSFile } from './types';
import _ from 'lodash';

export default connect(
    (state: any, props: FileViewProps) => {
        const filename = _.get(props, 'match.params.filename');
        return {
            filename,
            data: getData<AWSFile>(state, filename, ['data']),
            error: getData(state, filename, ['error'], null),
            loading: getData<boolean>(state, filename, ['loading'], false)
        };
    },
    { view }
)(withImmutablePropsToJS(FileView));
