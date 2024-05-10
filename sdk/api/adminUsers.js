/**
 * @module sdk/api/adminUsers
 * @description Admin Users API
 * @requires module:/fetchAPI
 */
import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a user.
 * @param {string} client_side_uuid The user's client_side_uuid
 * @returns {Promise<Object>} The user.
 */
async function find(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    const response = await fetchAPI.request(`admin/user/${client_side_uuid}`, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function findAll
 * @description Finds all users.
 * @returns {Promise<Object[]>} The users.
 * @throws {Error} If adminFindAllRequest is not provided.
 */
async function findAll(adminFindAllRequest) {
    if (typeof adminFindAllRequest !== 'object') {
        throw new Error('adminFindAllRequest must be an object');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/users?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
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

    const response = await fetchAPI.request('admin/users', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

/**
 * @function update
 * @description Updates a user.
 * @param {string} client_side_uuid The user's client_side_uuid
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The user.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(client_side_uuid, updateRequest) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request(`admin/user/${client_side_uuid}`, {
        method: 'PATCH',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a user.
 * @param {string} client_side_uuid The user's client_side_uuid
 * @returns {Promise<boolean>} Whether the user was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }
    
    const response = await fetchAPI.request(`admin/user/${client_side_uuid}`, {
        method: 'DELETE',
    }, true);

    if (response.status === 204) {
        return true;
    } else {
        return false;
    }
}

export default {
    find,
    findAll,
    create,
    update,
    destroy,
}
