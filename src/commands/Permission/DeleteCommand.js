import _DeleteCommand from "../abstractions/DeleteCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "name",
            "permission_name",
            "Permission",
            "PermissionRemoved"
        );
    }
}
