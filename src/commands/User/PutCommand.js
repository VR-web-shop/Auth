/**
 * @module commands/User/PutCommand
 * @description A module that provides a command for updating a user
 * @requires module:commands/abstractions/PutCommand
 * @requires module:sequelize
 */
import _PutCommand from "../abstractions/PutCommand.js";
import { Op } from "sequelize";

/**
 * @class PutCommand
 * @classdesc A command for updating a user
 * @extends commands/abstractions/PutCommand
 */
export default class PutCommand extends _PutCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} params - The user parameters
     */
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "user_client_side_uuid", 
            ["email", "password", "first_name", "last_name", "role_client_side_uuid"],
            "User",
            "UserDescription",
            "UserRemoved"
        );

        // Ensure to set the active email used to enforce unique constraint
        this.params.active_email = this.params.email;
        this.clientSideUUID = clientSideUUID;
    }

    /**
     * @method execute
     * @description The method that executes the command
     * @param {object} db - The database models
     * @param {array} beforeTransactions - The before transactions
     * @param {array} afterTransactions - The after transactions
     * @returns {Promise<void>} - The result of the command
     * @override
     * @async
     */
    async execute(db, beforeTransactions=[], afterTransactions=[]) {
        await super.execute(db, {
            beforeTransactions: [
                ...beforeTransactions,
                /**
                 * The idea here is that a user description's active email should be unique.
                 * However, since a single user can have multiple user descriptions, 
                 * we have to remove the active email from the old user description.
                 * But to ensure that the email is still recorded in the system,
                 * the table has a field called email without a unique constraint.
                 */
                async (t) => {
                    await db.UserDescription.update(
                        { active_email: null },
                        { where: { 
                            user_client_side_uuid: this.clientSideUUID,
                            active_email: { [Op.ne]: null }
                        }},
                        { transaction: t }
                    );
                }
            ],
            afterTransactions
        })
    }
}
