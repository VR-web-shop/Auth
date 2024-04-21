import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a role.
 * @returns {Promise<Object>} The role.
 */
async function find(adminFindRequest) {
    if (typeof adminFindRequest !== 'object') {
        throw new Error('adminFindRequest must be an object');
    }

    const { client_side_uuid } = adminFindRequest;
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
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The role.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/roles', {
        method: 'PUT',
        body: updateRequest
    }, true);

    return await response.json();
}

/**
 * @function destroy
 * @description Destroys a role.
 * @param {Object} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the role was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(deleteRequest) {
    if (typeof deleteRequest !== 'object') {
        throw new Error('deleteRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/roles', {
        method: 'DELETE',
        body: deleteRequest
    }, true);

    if (response.status === 203) {
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
