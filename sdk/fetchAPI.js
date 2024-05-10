/**
 * @module sdk/fetchAPI
 * @description Fetch API
 * @requires module:/sdk/errors/SDKFetchError
 * @requires module:/sdk/errors/SDKFetchMissingTokenError
 */
import SDKFetchError from './errors/SDKFetchError.js';
import SDKFetchMissingTokenError from './errors/SDKFetchMissingTokenError.js';

const apiPath = '/api/';
let apiVersion = 'v1';
let refreshMethod = null;
let serverURL = 'http://localhost:5173';
let tokenLocalStorageKey = 'auth';

/**
 * @function setServerURL
 * @description Sets the server URL
 * @param {string} url The server URL
 * @returns {void}
 */
function setServerURL(url) {
    serverURL = url;
}

/**
 * @function setRefreshMethod
 * @description Sets the refresh method
 * @param {function} method The refresh method
 * @returns {void}
 */
function setRefreshMethod(method) {
    refreshMethod = method;
}

/**
 * @function setAuthTokenKey
 * @description Sets the auth token key
 * @param {string} key The auth token key
 * @returns {void}
 */
function setAuthTokenKey(key) {
    localStorage.setItem(tokenLocalStorageKey, key);
}

/**
 * @function removeAuthToken
 * @description Removes the auth token
 * @returns {void}
 */
function removeAuthToken() {
    localStorage.removeItem(tokenLocalStorageKey);
}

/**
 * @function setAuthToken
 * @description Sets the auth token
 * @param {string} token The auth token
 * @returns {void}
 */
function setAuthToken(token) {
    localStorage.setItem(tokenLocalStorageKey, token);
}

/**
 * @function getAuthToken
 * @description Gets the auth token
 * @returns {string} The auth token
 */
function getAuthToken() {
    return localStorage.getItem(tokenLocalStorageKey);
}

/**
 * @function setAPIVersion
 * @description Sets the API version
 * @param {string} version The API version
 * @returns {void}
 */
function setAPIVersion(version) {
    apiVersion = version;
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

    const response = await fetch(`${serverURL}${apiPath}${apiVersion}/${endpoint}`, options);
    
    if (!response.ok) {
        const { statusText, status } = response.status;

        const isUnauthorized = status === 401 || status === 403 || status === 419;
        if (isUnauthorized && refreshes < 1) {
            if (refreshMethod) {
                await refreshMethod();
            }

            return request(endpoint, options, useAuth, refreshes + 1);
        }

        throw new SDKFetchError(statusText, status);
    }

    return response;
}

export default {
    setServerURL,
    setRefreshMethod,
    request,
    setAuthTokenKey,
    removeAuthToken,
    setAuthToken,
    getAuthToken,
    setAPIVersion
}
