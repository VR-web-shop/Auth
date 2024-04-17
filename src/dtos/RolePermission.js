
export default function RoleDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        role_client_side_uuid: entity.role_client_side_uuid,
        permission_name: entity.permission_name,
        created_at: entity.createdAt,
        updated_at: entity.updatedAt
    }
}
