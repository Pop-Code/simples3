export function getCredentials() {
    try {
        const credentials = window.localStorage.getItem('simples3:credentials');
        if (credentials) {
            return JSON.parse(credentials);
        }
    } catch (e) {
        console.log('Storage', e);
    }
}

export function setCredentials(credentials: any) {
    try {
        window.localStorage.setItem('simples3:credentials', JSON.stringify(credentials));
    } catch (e) {
        console.log('Storage', e);
    }
}

export function clearCredentials() {
    try {
        window.localStorage.removeItem('simples3:credentials');
    } catch (e) {
        console.log('Storage', e);
    }
}
