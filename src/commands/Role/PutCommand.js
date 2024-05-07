/**
 * @module commands/Role/PutCommand
 * @description A module that provides a command for updating a role
 * @requires module:commands/abstractions/PutCommand
 */
import _PutCommand from "../abstractions/PutCommand.js";

/**
 * @class PutCommand
 * @classdesc A command for updating a role
 * @extends commands/abstractions/PutCommand
 */
export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "role_client_side_uuid", 
            ["name", "description"],
            "Role",
            "RoleDescription",
            "RoleRemoved"
        );
    }
}
