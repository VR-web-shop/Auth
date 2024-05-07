/**
 * @module commands/User/DeleteCommand
 * @description A module that provides the command for deleting a user
 * @requires module:commands/abstractions/DeleteCommand
 */
import _DeleteCommand from "../abstractions/DeleteCommand.js";

/**
 * @class DeleteCommand
 * @classdesc A command for deleting a user
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
            "user_client_side_uuid",
            "User",
            "UserRemoved"
        );
    }
    
    /**
     * @function execute
     * @description Deletes a user
     * @param {object} db - The database
     * @param {array} afterTransactions - The after transactions
     * @returns {Promise<void>} - The result of the command
     * @override
     * @async
     */
    async execute(db, afterTransactions=[]) {
        await super.execute(db, { afterTransactions })
    }
}
