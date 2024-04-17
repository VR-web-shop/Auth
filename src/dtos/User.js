
export default function UserDTO(description, entity) {
    if (!description || typeof description !== "object") {
        throw new Error("description is required and must be an object");
    }

    if (!entity || typeof entity !== "object") {
        throw new Error("description is required and must be an object");
    }

    return {
        clientSideUUID: entity.client_side_uuid,
        first_name: description.first_name,
        last_name: description.last_name,
        email: description.email,
        created_at: entity.createdAt,
        updated_at: description.createdAt
    }
}
 