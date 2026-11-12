const URLParams = new URLSearchParams(window.location.href);

const API_REALM = process.env.REACT_APP_API_REALM || (
    typeof window !== 'undefined' && window.location && window.location.hostname
        ? `${window.location.protocol}//${window.location.hostname}:5001`
        : 'http://localhost:5001'
);

// Configs
export const config = {
    api_realm: API_REALM,
    api_url: `${API_REALM}/api`,
    dateFormat: 'YYYY-MM-DD',
    urlParams: URLParams
};