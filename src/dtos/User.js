/**
 * @module dtos/User
 * @description DTO for users
 * @requires module:dtos/Role
 */
import RoleDTO from "./Role.js";

/**
 * @function UserDTO
 * @description DTO for users
 * @param {object} entity - The user entity
 * @param {boolean} includePassword - Whether to include the password in the DTO
 * @returns {object} The user DTO
 */
export default function UserDTO(entity, includePassword=false) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }    
    
    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        first_name: entity.first_name,
        last_name: entity.last_name,
        email: entity.email,
        created_at: entity.createdAt,
        updated_at: entity.createdAt,
        role_client_side_uuid: entity.role_client_side_uuid
    }

    if (includePassword) {
        attributes.password = entity.password
    }
    
    if (entity.roles && entity.roles.length > 0) {
        const role = entity.roles[0]
        const description = role.RoleDescriptions ? role.RoleDescriptions[0] : {}
        attributes.role = RoleDTO(description, role)
    }

    return attributes
}
