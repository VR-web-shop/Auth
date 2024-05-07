/**
 * @module commands/Role/DeleteCommand
 * @description A module that provides a command for deleting a role
 * @requires module:commands/abstractions/DeleteCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import _DeleteCommand from "../abstractions/DeleteCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class DeleteCommand
 * @classdesc A command for deleting a role
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
            "role_client_side_uuid",
            "Role",
            "RoleRemoved"
        );
    }

    /**
     * @method execute
     * @description Method for executing the command
     * @param {object} db - The database connection
     * @returns {Promise<void>} - The result of the command
     * @throws {APIActorError} If the role is defined by the system
     * @override
     * @async
     */
    async execute(db) {
        await super.execute(db, { 
            afterTransactions: [
                async (db, entity) => {
                    if (entity.defined_by_system) {
                        throw new APIActorError(`Role ${entity.client_side_uuid} is defined by the system and cannot be deleted`, 400);
                    }
                }
            ]
        })
    }
}
