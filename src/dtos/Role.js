import PermissionDTO from "./Permission.js";

export default function RoleDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        name: entity.name,
        description: entity.description,
        created_at: entity.createdAt,
        updated_at: entity.createdAt,
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
 