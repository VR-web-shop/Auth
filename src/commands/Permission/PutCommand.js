import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(name, params) {
        super(
            name, 
            params, 
            "name",
            "permission_name", 
            ["description"],
            "Permission",
            "PermissionDescription",
            "PermissionRemoved"
        );
    }
}
