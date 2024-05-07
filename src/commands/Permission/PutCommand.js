/**
 * @module commands/Permission/PutCommand
 * @description A module that provides a command for updating a permission
 * @requires module:commands/abstractions/PutCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import _PutCommand from "../abstractions/PutCommand.js";

/**
 * @class PutCommand
 * @classdesc A command for updating a permission
 * @extends commands/abstractions/PutCommand
 */
export default class PutCommand extends _PutCommand {

    /**
     * @constructor
     * @param {string} name - The permission name
     * @param {object} params - The permission parameters
     */
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
