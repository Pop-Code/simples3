import { connect } from 'react-redux';
import FileView, { FileViewProps } from './component';
import { view, getData } from './actions';
import { withImmutablePropsToJS } from '../../components';
import _ from 'lodash';

export default connect(
    (state: any, props: FileViewProps) => {
        const filename = _.get(props, 'match.params.filename');
        return {
            filename,
            data: getData(state, filename, ['data'], null),
            error: getData(state, filename, ['error'], null),
            loading: getData(state, filename, ['loading'], false)
        };
    },
    { view }
)(withImmutablePropsToJS(FileView));
