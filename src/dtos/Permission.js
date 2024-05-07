/**
 * @module dtos/Permission
 * @description DTO for permissions
 * @requires module:dtos/Role
 */
import RoleDTO from "./Role.js";

/**
 * @function PermissionDTO
 * @description DTO for permissions
 * @param {object} entity - The permission entity
 * @returns {object} The permission DTO
 */
export default function PermissionDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    const attributes = {
        name: entity.name,
        description: entity.description,
        created_at: entity.createdAt,
        updated_at: entity.createdAt,
        defined_by_system: entity.defined_by_system
    }

    if (entity.roles && entity.roles.length > 0) {
        attributes.roles = entity.roles.map(role => {
            const description = role.RoleDescription || {};
            return RoleDTO(description, role);
        });
    }

    return attributes;
}
