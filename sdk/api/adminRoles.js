import RoleResponse from '../../src/dtos/RoleResponse.js';
import fetchAPI from '../fetchAPI.js'

/**
 * @function findAll
 * @description Finds all roles.
 * @returns {Promise<RoleResponse>} The roles.
 */
async function findAll() {
    const response = await fetchAPI.request('admin/roles', { method: 'GET' }, true);
    const data = await response.json();
    const roles = data.map(role => new RoleResponse(role));
    return roles;
}

export default {
    findAll,
}
