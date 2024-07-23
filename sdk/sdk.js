/**
 * @module sdk/sdk
 * @description The SDK object
 * @requires module:/sdk/fetchAPI
 * @requires module:/sdk/errors/SDKFetchError
 * @requires module:/sdk/errors/SDKFetchMissingTokenError
 * @requires module:/sdk/api/users
 * @requires module:/sdk/api/authentication
 * @requires module:/sdk/api/adminUsers
 * @requires module:/sdk/api/adminRoles
 * @requires module:/sdk/api/adminRolePermissions
 * @requires module:/sdk/api/adminPermissions
 * @requires module:/sdk/api/adminHealth
 */
import fetchAPI from './fetchAPI.js'

import SDKFetchMissingTokenError from './errors/SDKFetchMissingTokenError.js'
import SDKFetchError from './errors/SDKFetchError.js'

import users from './api/users.js'
import authentication from './api/authentication.js'
import adminUsers from './api/adminUsers.js'
import adminRoles from './api/adminRoles.js'
import adminRolePermissions from './api/adminRolePermissions.js'
import adminPermissions from './api/adminPermissions.js'
import adminHealth from './api/adminHealth.js'

/**
 * @function SDK
 * @description The SDK constructor
 * @param {string} serverURL The server URL
 * @param {string} APIVersion The API version
 * @param {object} options The options
 * @returns {object} The SDK object
 * @throws {Error} If serverURL is not provided
 * @example const s = new SDK('http://localhost:3000', 'v1, { authTokenKey: 'auth' });
 */
const SDK = function(serverURL, APIVersion = 'v1', options={}) {
    if (!serverURL) {
        throw new Error('serverURL is required');
    }

    fetchAPI.setServerURL(serverURL);
    fetchAPI.setAPIVersion(APIVersion);
    fetchAPI.setRefreshMethod(authentication.refresh);

    if (options.authTokenKey) {
        fetchAPI.setAuthTokenKey(options.authTokenKey);
    }

    /**
     * @property {function} request The SDK fetch request
     * @param {string} endpoint The endpoint to fetch (without the '/' at the beginning)
     * @param {object} options The fetch options
     * @param {boolean} useAuth Whether to use authentication or not
     * @param {number} refreshes The number of times the token has been refreshed in the same request (Note: Used internally by the SDK, do not use it directly)
     * @returns {Promise<Response>} The fetch response
     * @throws {SDKFetchError} If the fetch fails
     * @example const response = await s.request('user', { method: 'GET' }, true);
     */
    this.request = fetchAPI.request;

    /**
     * @property {object} token The SDK token utilities
     */
    this.token = {
        set: fetchAPI.setAuthToken,
        get: fetchAPI.getAuthToken,
        remove: fetchAPI.removeAuthToken
    }
    
    /**
     * @property {object} api The SDK API utilities
     */
    this.api = {
        users,
        authentication,
        adminUsers,
        adminRoles,
        adminRolePermissions,
        adminPermissions,
        adminHealth,
    }

    /**
     * @property {object} errors The SDK errors
     */
    this.errors = {
        SDKFetchError,
        SDKFetchMissingTokenError,
    }
}

export default SDK
