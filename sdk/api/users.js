import fetchAPI from '../fetchAPI.js'

/**
 * @function findMe
 * @description Get the authenticated user.
 * @returns {Promise<Object>} The user.
 */
async function findMe() {
    const response = await fetchAPI.request('user', { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function create
 * @description Creates a user.
 * @param {Object} createRequest The create request.
 * @returns {Promise<Object>} The user.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    } 

    const response = await fetchAPI.request('users', {
        method: 'POST',
        body: createRequest
    }, true);

    const data = await response.json();
    fetchAPI.setAuthToken(data.access_token);

    return data;
}

/**
 * @function update
 * @description Updates a user.
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The user.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    } 
    
    const response = await fetchAPI.request('users', {
        method: 'PUT',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a user.
 * @param {Object} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the user was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(deleteRequest) {
    if (typeof deleteRequest !== 'object') {
        throw new Error('deleteRequest must be an object');
    }
    
    const response = await fetchAPI.request('users', {
        method: 'DELETE',
        body: deleteRequest
    }, true);

    if (response.status === 204) {
        return true;
    } else {
        return false;
    }
}

/**
 * @function getPermissions
 * @description Gets the user permissions.
 * @returns {Array} The user permissions.
 */
function getPermissions() {
    const token = fetchAPI.getAuthToken();
    if (!token) {
        return [];
    }

    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    return parsedToken.permissions;
}

/**
 * @function hasPermission
 * @description Checks if the user has a permission.
 * @param {string} permissionName The permission name.
 * @returns {Promise<boolean>} Whether the user has the permission or not.
 */
function hasPermission(permissionName) {
    const permissions = getPermissions();
    for (const permission of permissions) {
        if (permission.name === permissionName) {
            return true;
        }
    }

    return false;
}

export default {
    findMe,
    create,
    update,
    destroy,
    getPermissions,
    hasPermission
}
