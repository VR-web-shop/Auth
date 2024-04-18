
export default function RoleDTO(description, entity) {
    if (!description || typeof description !== "object") {
        throw new Error("description is required and must be an object");
    }

    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        name: description.name,
        description: description.description,
        created_at: entity.createdAt,
        updated_at: description.createdAt,
        definedBySystem: entity.defined_by_system
    }
}
 