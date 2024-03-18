import RoleRequest from '../../src/dtos/RoleRequest.js';
import RoleResponse from '../../src/dtos/RoleResponse.js';
import fetchAPI from '../fetchAPI.js'

/**
 * @function find
 * @description Finds a role.
 * @returns {Promise<RoleRequest>} The role.
 */
async function find(adminFindRequest) {
    if (!(adminFindRequest instanceof RoleRequest.AdminFindRequest)) {
        throw new Error('adminFindRequest must be an instance of RoleRequest.AdminFindRequest');
    }

    const { name } = adminFindRequest;
    const response = await fetchAPI.request(`admin/role/${name}`, { method: 'GET' }, true);
    const data = await response.json();
    return new RoleResponse(data);
}

/**
 * @function findPermissions
 * @description Gets the role's permissions by name.
 * @returns {Promise<PermissionResponse>} The role permissions.
 */
async function findPermissions(adminFindRequest) {
    if (!(adminFindRequest instanceof RoleRequest.AdminFindRequest)) {
        throw new Error('adminFindRequest must be an instance of RoleRequest.AdminFindRequest');
    }
    
    const { name } = adminFindRequest;
    const response = await fetchAPI.request(`admin/role/${name}/permissions`, { method: 'GET' }, true);
    const data = await response.json();
    return data.map(permission => new PermissionResponse(permission));
}

/**
 * @function findAll
 * @description Finds all roles.
 * @returns {Promise<RoleRequest[]>} The roles.
 * @throws {Error} If adminFindAllRequest is not provided.
 */
async function findAll(adminFindAllRequest) {
    if (!(adminFindAllRequest instanceof RoleRequest.AdminFindAllRequest)) {
        throw new Error('adminFindAllRequest must be an instance of RoleRequest.AdminFindAllRequest');
    }

    const { page, limit } = adminFindAllRequest;
    let endpoint = `admin/roles?limit=${limit}`;
    if (page) endpoint += `&page=${page}`;
    const response = await fetchAPI.request(endpoint, { method: 'GET' }, true);
    const data = await response.json();
    return {roles: data.roles.map(role => new RoleResponse(role)), pages: data.pages};
}

/**
 * @function create
 * @description Creates a role.
 * @param {RoleRequest.AdminCreateRequest} createRequest The create request.
 * @returns {Promise<RoleResponse>} The role.
 * @throws {Error} If createRequest is not provided.
 */
async function create(createRequest) {
    if (!(createRequest instanceof RoleRequest.AdminCreateRequest)) {
        throw new Error('createRequest must be an instance of RoleRequest.AdminCreateRequest');
    }

    const response = await fetchAPI.request('admin/roles', {
        method: 'POST',
        body: createRequest
    }, true);

    const data = await response.json();
    return new RoleResponse(data);
}

/**
 * @function update
 * @description Updates a roles.
 * @param {RoleRequest.AdminDeleteRequest} updateRequest The update request.
 * @returns {Promise<RoleResponse>} The role.
 * @throws {Error} If updateRequest is not provided.
 */
async function update(updateRequest) {
    if (!(updateRequest instanceof RoleRequest.AdminUpdateRequest)) {
        throw new Error('updateRequest must be an instance of RoleRequest.AdminDeleteRequest');
    }
    
    const response = await fetchAPI.request('admin/roles', {
        method: 'PUT',
        body: updateRequest
    }, true);

    const data = await response.json();
    return new RoleResponse(data);
}

/**
 * @function destroy
 * @description Destroys a role.
 * @param {RoleRequest.AdminDeleteRequest} deleteRequest The destroy request.
 * @returns {Promise<boolean>} Whether the role was destroyed or not.
 * @throws {Error} If deleteRequest is not provided.
 */
async function destroy(deleteRequest) {
    if (!(deleteRequest instanceof RoleRequest.AdminDeleteRequest)) {
        throw new Error('deleteRequest must be an instance of RoleRequest.AdminDeleteRequest');
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
    findPermissions,
    findAll,
    create,
    update,
    destroy,
}
