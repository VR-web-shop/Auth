/**
 * @module sdk/api/authentication
 * @description Authentication API
 * @requires module:/fetchAPI
 */
import fetchAPI from '../fetchAPI.js'

/**
 * @function login
 * @description Logs in a user.
 * @param {Object} authCreateRequest The login request.
 * @returns {Promise<Object>} The user.
 * @throws {Error} If authCreateRequest is not provided.
 */
async function login(authCreateRequest) {
    if (typeof authCreateRequest !== 'object') {
        throw new Error('authCreateRequest must be an object');
    } 

    const response = await fetchAPI.request('auth', {
        method: 'POST',
        credentials: 'include',
        body: authCreateRequest
    });

    const data = await response.json();
    fetchAPI.setAuthToken(data.access_token);

    return data;
}

/**
 * @function refresh
 * @description Refreshes a user's token.
 * @returns {Promise<Object>} The user.
 */
async function refresh() {
    const response = await fetchAPI.request('auth', {
        method: 'PUT',
        credentials: 'include'
    });

    const data = await response.json();
    fetchAPI.setAuthToken(data.access_token);

    return data;
}

export default {
    login,
    refresh,    
}
