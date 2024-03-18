import fetchAPI from './fetchAPI.js'

import DTOArgumentError from '../src/dtos/errors/DTOArgumentError.js'
import DTORequestParameterError from '../src/dtos/errors/DTORequestParameterError.js'
import DTOResponseParameterError from '../src/dtos/errors/DTOResponseParameterError.js'
import SDKFetchMissingTokenError from './errors/SDKFetchMissingTokenError.js'
import SDKFetchError from './errors/SDKFetchError.js'

import AuthRequest from '../src/dtos/AuthRequest.js'
import AuthResponse from '../src/dtos/AuthResponse.js'
import RoleResponse from '../src/dtos/RoleResponse.js'
import UserRequest from '../src/dtos/UserRequest.js'
import UserResponse from '../src/dtos/UserResponse.js'

import users from './api/users.js'
import authentication from './api/authentication.js'
import adminUsers from './api/adminUsers.js'
import adminRoles from './api/adminRoles.js'
import adminPermissions from './api/adminPermissions.js'

/**
 * @function SDK
 * @description The SDK constructor
 * @param {string} serverURL The server URL
 * @param {object} options The options
 * @returns {object} The SDK object
 * @throws {Error} If serverURL is not provided
 * @example const s = new SDK('http://localhost:3000', { authTokenKey: 'auth' });
 */
const SDK = function(serverURL, options={}) {
    if (!serverURL) {
        throw new Error('serverURL is required');
    }

    fetchAPI.setServerURL(serverURL);
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
        adminPermissions
    }

    /**
     * @property {object} requests The SDK API requests
     */
    this.requests = {
        AuthRequest,
        UserRequest
    }

    /**
     * @property {object} responses The SDK API responses
     */
    this.responses = {
        AuthResponse,
        RoleResponse,
        UserResponse
    }

    /**
     * @property {object} errors The SDK errors
     */
    this.errors = {
        SDKFetchError,
        SDKFetchMissingTokenError,
        DTOArgumentError,
        DTORequestParameterError,
        DTOResponseParameterError
    }
}

export default SDK
