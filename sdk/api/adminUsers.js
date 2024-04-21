import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a user.
 * @param {Object} adminFindRequest The find request.
 * @returns {Promise<Object>} The user.
 */
async function find(adminFindRequest) {
    if (typeof adminFindRequest !== 'object') {
        throw new Error('adminFindRequest must be an object');
    } 

    const { client_side_uuid } = adminFindRequest;
    const response = await fetchAPI.request(`admin/user/${client_side_uuid}`, { method: 'GET' }, true);
    return await response.json();
}

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
 * @param {Object} updateRequest The update request.
 * @returns {Promise<Object>} The user.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (typeof updateRequest !== 'object') {
        throw new Error('updateRequest must be an object');
    }
    
    const response = await fetchAPI.request('admin/users', {
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
    
    const response = await fetchAPI.request('admin/users', {
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
