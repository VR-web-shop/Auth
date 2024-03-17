import SDKFetchError from './errors/SDKFetchError.js';
import SDKFetchMissingTokenError from './errors/SDKFetchMissingTokenError.js';
import authentication from './utilities/authentication.js';

const apiPath = '/api/v1/';

let serverURL = 'http://localhost:5173';
let tokenLocalStorageKey = 'auth';

function setServerURL(url) {
    serverURL = url;
}

function setAuthTokenKey(key) {
    localStorage.setItem(tokenLocalStorageKey, key);
}

function removeAuthToken() {
    localStorage.removeItem(tokenLocalStorageKey);
}

function setAuthToken(token) {
    localStorage.setItem(tokenLocalStorageKey, token);
}

function getAuthToken() {
    return localStorage.getItem(tokenLocalStorageKey);
}

/**
 * @function fetchAPI
 * @description Fetches data from the API. It automatically add content-type 
 * header and stringifies the body if it exists.
 * @param {string} endpoint The endpoint to fetch (without the '/' at the beginning)
 * @param {object} options The fetch options
 * @param {boolean} useAuth Whether to use authentication or not
 * @param {number} refreshes The number of times the token has been refreshed in the same request
 * @returns {Promise<Response>} The fetch response
 * @throws {SDKFetchError} If the fetch fails
 */
async function request(endpoint, options, useAuth = false, refreshes = 0) {
    if (options && options.body) {
        options.body = JSON.stringify(options.body);

        if (!options.headers) options.headers = {};
        if (!options.headers['Content-Type']) {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            }
        }
    }

    if (useAuth) {
        const token = getAuthToken();
        if (token) {
            if (!options.headers) options.headers = {};
            if (!options.headers['Authorization']) {
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                };
            }
        } else {
            throw new SDKFetchMissingTokenError('No token found, please call login() first');
        }
    }

    const response = await fetch(`${serverURL}${apiPath}${endpoint}`, options);
    
    if (!response.ok) {
        const { statusText, status } = response.status;

        const isUnauthorized = status === 401 || status === 403 || status === 419;
        if (isUnauthorized && refreshes < 1) {
            await authentication.refresh();
            return request(endpoint, options, useAuth, refreshes + 1);
        }

        throw new SDKFetchError(statusText, status);
    }

    return response;
}

export default {
    setServerURL,
    request,
    setAuthTokenKey,
    removeAuthToken,
    setAuthToken,
    getAuthToken
}
