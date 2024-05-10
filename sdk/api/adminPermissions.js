/**
 * @module sdk/api/adminPermissions
 * @description Admin Permissions API
 * @requires module:/fetchAPI
 */

import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a permission.
 * @param {string} name The permission's name
 * @returns {Promise<Object>} The permission.
 */
async function find(name) {
    if (typeof name !== 'string') {
        throw new Error('name must be a string');
    }

    const response = await fetchAPI.request(`admin/permission/${name}`, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function findAll
 * @description Finds all permissions.
 * @returns {Promise<Object[]>} The permissions.
 * @throws {Error} If findAllRequest is not provided.
 */
async function findAll(findAllRequest) {
    if (typeof findAllRequest !== 'object') {
        throw new Error('findAllRequest must be an object');
    }

    const { page, limit } = findAllRequest;
    let endpoint = `admin/permissions?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    return await response.json();
}

/**
 * @function create
 * @description Creates a permission.
 * @param {Object} createRequest The create request.
 * @returns {Promise<Object>} The permission.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (typeof createRequest !== 'object') {
        throw new Error('createRequest must be an object');
    }

    const response = await fetchAPI.request('admin/permissions', {
        method: 'POST',
        body: createRequest
    }, true);

    return await response.json();
}

/**
 * @function update
 * @description Updates a permission.
 * @param {string} name The permission's name
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The permission.
 * @throws {Error} If name is not provided.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(name, updateRequest) {
    if (typeof name !== 'string') {
        throw new Error('name must be a string');
    }

    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request(`admin/permission/${name}`, {
        method: 'PATCH',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a permission.
 * @param {string} name The permission's name
 * @returns {Promise<boolean>} Whether the permission was destroyed or not.
 * @throws {Error} If name is not provided.
 */
async function destroy(name) {
    if (typeof name !== 'string') {
        throw new Error('name must be a string');
    }
    
    const response = await fetchAPI.request(`admin/permission/${name}`, {
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
    destroy
}
