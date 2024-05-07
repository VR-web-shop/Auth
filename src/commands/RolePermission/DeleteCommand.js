/**
 * @module commands/RolePermission/DeleteCommand
 * @description A module that provides the command for deleting a role permission
 * @requires module:commands/abstractions/DeleteCommand
 */
import _DeleteCommand from "../abstractions/DeleteCommand.js";

/**
 * @class DeleteCommand
 * @classdesc A command for deleting a role permission
 * @extends commands/abstractions/DeleteCommand
 */
export default class DeleteCommand extends _DeleteCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     */
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
