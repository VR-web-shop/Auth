/**
 * @module dtos/Role
 * @description DTO for roles
 * @requires module:dtos/Permission
 */
import PermissionDTO from "./Permission.js";

/**
 * @function RoleDTO
 * @description DTO for roles
 * @param {object} entity - The role entity
 * @returns {object} The role DTO
 */
export default function RoleDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        name: entity.name,
        description: entity.description,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
        defined_by_system: entity.defined_by_system
    }

    if (entity.permissions && entity.permissions.length > 0) {
        attributes.permissions = entity.permissions.map(permission => {
            const desc = permission.PermissionDescription || {}
            return PermissionDTO(desc, permission)
        })
    }
    
    return attributes
}
 