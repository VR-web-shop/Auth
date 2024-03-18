import Permission from "../models/Permission.js";
import PermissionResponse from "../dtos/PermissionResponse.js";

/**
 * @function findAll
 * @description Find all permissions
 * @returns {Promise<RoleResponse[]>} response
 */
async function findAll() {
    const permissions = await Permission.findAll()

    return permissions.map(permission => new PermissionResponse(permission))
}

export default {
    findAll
}
