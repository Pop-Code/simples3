export function getCredentials() {
    try {
        const credentials = window.localStorage.getItem('credentials');
        if (credentials) {
            return JSON.parse(credentials);
        }
    } catch (e) {
        return null;
    }
}

export function setCredentials(credentials: any) {
    try {
        window.localStorage.setItem('credentials', JSON.stringify(credentials));
    } catch (e) {
        return null;
    }
}
