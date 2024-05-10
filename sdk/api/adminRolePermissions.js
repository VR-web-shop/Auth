/**
 * @module sdk/api/adminRolePermissions
 * @description Admin Role Permissions API
 * @requires module:/fetchAPI
 */
import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a role_permission.
 * @param {string} client_side_uuid The role_permission's client_side_uuid
 * @returns {Promise<Object>} The role_permission.
 */
async function find(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    const response = await fetchAPI.request(`admin/role_permissions/${client_side_uuid}`, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function findAll
 * @description Finds all role_permissions.
 * @returns {Promise<Object[]>} The role_permissions.
 * @throws {Error} If adminFindAllRequest is not provided.
 */
async function findAll(adminFindAllRequest) {
    if (typeof adminFindAllRequest !== 'object') {
        throw new Error('adminFindAllRequest must be an object');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/role_permissions?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function create
 * @description Creates a role_permission.
 * @param {Object} createRequest The create request.
 * @returns {Promise<Object>} The role_permission.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    }

    const response = await fetchAPI.request('admin/role_permissions', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

/**
 * @function update
 * @description Updates a role_permission.
 * @param {string} client_side_uuid The role_permission's client_side_uuid
 * @param {Object} updateRequest The update request.
 */
async function update(client_side_uuid, updateRequest) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }

    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request(`admin/role_permission/${client_side_uuid}`, {
        method: 'PATCH',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a role_permission.
 * @param {string} client_side_uuid The role_permission's client_side_uuid
 * @returns {Promise<boolean>} Whether the role_permission was destroyed or not.
 * @throws {Error} If client_side_uuid is not provided.
 */
async function destroy(client_side_uuid) {
    if (typeof client_side_uuid !== 'string') {
        throw new Error('client_side_uuid must be a string');
    }
    
    const response = await fetchAPI.request(`admin/role_permission/${client_side_uuid}`, {
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
