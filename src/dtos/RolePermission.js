/**
 * @module dtos/RolePermission
 * @description DTO for role permissions
 */

/**
 * @function RolePermissionDTO
 * @description DTO for role permissions
 * @param {object} entity - The role permission entity
 * @returns {object} The role permission DTO
 */
export default function RolePermissionDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        client_side_uuid: entity.client_side_uuid,
        role_client_side_uuid: entity.role_client_side_uuid,
        permission_name: entity.permission_name,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt
    }
}
