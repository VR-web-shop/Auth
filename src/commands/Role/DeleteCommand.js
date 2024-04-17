import _DeleteCommand from "../abstractions/DeleteCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            "role_client_side_uuid",
            "Role",
            "RoleRemoved"
        );
    }
}
