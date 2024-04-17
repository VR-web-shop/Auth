import _DeleteCommand from "../abstractions/DeleteCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            "role_permission_client_side_uuid",
            "RolePermission",
            "RolePermissionRemoved"
        );
    }
}
