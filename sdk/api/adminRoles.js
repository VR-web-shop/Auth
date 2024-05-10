/**
 * @module sdk/api/adminRoles
 * @description Admin Roles API
 * @requires module:/fetchAPI
 */
import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a role.
 * @param {string} client_side_uuid The role's client_side_uuid
 * @returns {Promise<Object>} The role.
 */
async function find(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    const response = await fetchAPI.request(`admin/role/${client_side_uuid}`, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function findAll
 * @description Finds all roles.
 * @returns {Promise<Object[]>} The roles.
 * @throws {Error} If adminFindAllRequest is not provided.
 */
async function findAll(adminFindAllRequest) {
    if (typeof adminFindAllRequest !== 'object') {
        throw new Error('adminFindAllRequest must be an object');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/roles?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function create
 * @description Creates a role.
 * @param {Object} createRequest The create request.
 * @returns {Promise<Object>} The role.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    }

    const response = await fetchAPI.request('admin/roles', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

/**
 * @function update
 * @description Updates a roles.
 * @param {string} client_side_uuid The role's client_side_uuid
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The role.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(client_side_uuid, updateRequest) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request(`admin/role/${client_side_uuid}`, {
        method: 'PUT',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a role.
 * @param {string} client_side_uuid The role's client_side_uuid
 * @returns {Promise<boolean>} Whether the role was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }
    
    const response = await fetchAPI.request(`admin/role/${client_side_uuid}`, {
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
