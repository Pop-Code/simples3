import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';
import { isImmutable } from 'immutable';

const getDisplayName = (Component: any) => {
    return Component.displayName || Component.name || 'Component';
};

const withImmutablePropsToJS = (WrappedComponent: any) => {
    const Wrapper = (props: any) => {
        const propsJS = Object.entries(props).reduce(
            (newProps: any, [propKey, propValue]: any[]) => {
                newProps[propKey] = isImmutable(propValue)
                    ? propValue.toJS()
                    : propValue;
                return newProps;
            },
            {}
        );
        return <WrappedComponent {...propsJS} />;
    };

    Wrapper.displayName = `withImmutablePropsToJS(${getDisplayName(
        WrappedComponent
    )})`;

    return hoistNonReactStatics(Wrapper, WrappedComponent);
};

export default withImmutablePropsToJS;
