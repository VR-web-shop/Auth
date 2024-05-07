/**
 * @module commands/RolePermission/CreateCommand
 * @description A module that provides the command for creating a role permission
 * @requires module:commands/abstractions/CreateCommand
 */
import _CreateCommand from "../abstractions/CreateCommand.js";

/**
 * @class CreateCommand
 * @classdesc A command for creating a role permission
 * @extends commands/abstractions/CreateCommand
 */
export default class CreateCommand extends _CreateCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} params - The role permission parameters
     */
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "RolePermission"
        );
    }
}
