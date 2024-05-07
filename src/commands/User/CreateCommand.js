/**
 * @module commands/User/CreateCommand
 * @description A module that provides the command for creating a user
 * @requires module:commands/abstractions/CreateCommand
 */
import _CreateCommand from "../abstractions/CreateCommand.js";

/**
 * @class CreateCommand
 * @classdesc A command for creating a user
 * @extends commands/abstractions/CreateCommand
 */
export default class CreateCommand extends _CreateCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} snapshotParams - The user snapshot parameters
     */
    constructor(clientSideUUID, snapshotParams) {
        super(
            clientSideUUID, 
            {}, 
            "client_side_uuid",
            "User",
            "user_client_side_uuid",
            "UserDescription",
            snapshotParams
        );
        // Ensure to set the active email used to enforce unique constraint
        this.snapshotParams.active_email = this.snapshotParams.email;
    }
}
