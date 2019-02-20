/**
 * @module context
 */

import { createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        /*primary: {
            light: grey[700],
            main: common.black,
            dark: common.black
        },
        secondary: {
            light: common.white,
            main: grey[500],
            dark: grey[700]
        }*/
        /*secondary: {
            main: grey[800]
        },*/
        /*primary: {
            main: deepOrange[600]
        }*/
    },
    typography: {
        useNextVariants: true
    }
});

interface PageContext {
    theme: any;
    generateClassName: any;
}

function createPageContext(): PageContext {
    return {
        theme,
        generateClassName: createGenerateClassName()
    };
}

let pageContext: PageContext;
export function getPageContext() {
    // Make sure to create a new context for every server-side request so that data
    // isn't shared between connections (which would be bad).
    if (!(process as any).browser) {
        return createPageContext();
    }

    // Reuse context on the client-side.
    if (!pageContext) {
        pageContext = createPageContext();
    }

    return pageContext;
}
