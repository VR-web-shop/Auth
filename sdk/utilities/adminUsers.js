import UserRequest from '../../src/dtos/UserRequest.js'
import UserResponse from '../../src/dtos/UserResponse.js'
import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a user.
 * @returns {Promise<UserResponse>} The user.
 */
async function find(adminFindRequest) {
    if (!(adminFindRequest instanceof UserRequest.AdminFindRequest)) {
        throw new Error('adminFindRequest must be an instance of UserRequest.AdminFindRequest');
    }

    const { uuid } = adminFindRequest;
    const response = await fetchAPI.request(`admin/user/${uuid}`, { method: 'GET' }, true);
    const data = await response.json();
    return new UserResponse(data);
}

async function findAll(adminFindAllRequest) {
    if (!(adminFindAllRequest instanceof UserRequest.AdminFindAllRequest)) {
        throw new Error('adminFindAllRequest must be an instance of UserRequest.AdminFindAllRequest');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/users?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    const data = await response.json();
    return data.map(user => new UserResponse(user));
}

/**
 * @function create
 * @description Creates a user.
 * @param {UserRequest.AdminCreateRequest} createRequest The create request.
 * @returns {Promise<UserResponse>} The user.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (!(createRequest instanceof UserRequest.AdminCreateRequest)) {
        throw new Error('createRequest must be an instance of UserRequest.AdminCreateRequest');
    }

    const response = await fetchAPI.request('admin/users', {
        method: 'POST',
        body: createRequest
    }, true);

    const data = await response.json();
    return new UserResponse(data);
}

/**
 * @function update
 * @description Updates a user.
 * @param {UserRequest.AdminDeleteRequest} updateRequest The update request.
 * @returns {Promise<UserResponse>} The user.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (!(updateRequest instanceof UserRequest.AdminUpdateRequest)) {
        throw new Error('updateRequest must be an instance of UserRequest.AdminDeleteRequest');
    }
    
    const response = await fetchAPI.request('admin/users', {
        method: 'PUT',
        body: updateRequest
    }, true);

    const data = await response.json();
    return new UserResponse(data);
}

/**
 * @function destroy
 * @description Destroys a user.
 * @param {UserRequest.AdminDeleteRequest} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the user was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(deleteRequest) {
    if (!(deleteRequest instanceof UserRequest.AdminDeleteRequest)) {
        throw new Error('deleteRequest must be an instance of UserRequest.AdminDeleteRequest');
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
