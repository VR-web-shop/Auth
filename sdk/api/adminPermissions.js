import PermissionResponse from '../../src/dtos/PermissionResponse.js';
import fetchAPI from '../fetchAPI.js'

/**
 * @function findAll
 * @description Finds all permissions.
 * @returns {Promise<PermissionResponse>} The permissions.
 */
async function findAll() {
    const permission = await fetchAPI.request('admin/permissions', { method: 'GET' }, true);
    const data = await response.json();
    const permissions = data.map(role => new PermissionResponse(permission));
    return permissions;
}

export default {
    findAll,
}
