import Role from "../models/Role.js";
import RoleResponse from "../dtos/RoleResponse.js";

/**
 * @function findAll
 * @description Find all roles
 * @returns {Promise<RoleResponse[]>} response
 */
async function findAll() {
    const roles = await Role.findAll()

    return roles.map(role => new RoleResponse(role))
}

export default {
    findAll
}
