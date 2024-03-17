import UserRequest from '../../src/dtos/UserRequest.js'
import UserResponse from '../../src/dtos/UserResponse.js'
import AuthResponse from '../../src/dtos/AuthResponse.js';
import fetchAPI from '../fetchAPI.js'

/**
 * @function findMe
 * @description Get the authenticated user.
 * @returns {Promise<UserResponse>} The user.
 */
async function findMe() {
    const response = await fetchAPI.request('user', { method: 'GET' }, true);
    const data = await response.json();
    return new UserResponse(data);
}

/**
 * @function create
 * @description Creates a user.
 * @param {UserRequest.CreateRequest} createRequest The create request.
 * @returns {Promise<UserResponse>} The user.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (!(createRequest instanceof UserRequest.CreateRequest)) {
        throw new Error('createRequest must be an instance of UserRequest.CreateRequest');
    }

    const response = await fetchAPI.request('users', {
        method: 'POST',
        body: createRequest
    }, true);

    const data = await response.json();
    const res = new AuthResponse(data);
    fetchAPI.setAuthToken(res.access_token);

    return res;
}

/**
 * @function update
 * @description Updates a user.
 * @param {UserRequest.UpdateRequest} updateRequest The update request.
 * @returns {Promise<UserResponse>} The user.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (!(updateRequest instanceof UserRequest.UpdateRequest)) {
        throw new Error('updateRequest must be an instance of UserRequest.UpdateRequest');
    }
    
    const response = await fetchAPI.request('users', {
        method: 'PUT',
        body: updateRequest
    }, true);

    const data = await response.json();
    return new UserResponse(data);
}

/**
 * @function destroy
 * @description Destroys a user.
 * @param {UserRequest.DestroyRequest} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the user was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(deleteRequest) {
    if (!(deleteRequest instanceof UserRequest.DestroyRequest)) {
        throw new Error('deleteRequest must be an instance of UserRequest.DestroyRequest');
    }
    
    const response = await fetchAPI.request('users', {
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
    findMe,
    create,
    update,
    destroy,
}
