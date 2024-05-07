/**
 * @module commands/User/ProtectedDeleteCommand
 * @description A module that provides the command for deleting a user with password verification
 * @requires module:commands/User/DeleteCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import _DeleteCommand from "./DeleteCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ProtectedDeleteCommand
 * @classdesc A command for deleting a user with password verification
 * @extends commands/User/DeleteCommand
 */
export default class ProtectedDeleteCommand extends _DeleteCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {string} verifyPassword - The password to verify
     * @throws Will throw an error if verifyPassword is not provided
     */
    constructor(clientSideUUID, verifyPassword) {
        super(clientSideUUID);

        if (!verifyPassword) {
            throw new Error("verifyPassword is required");
        }

        this.verifyPassword = verifyPassword;
    }

    /**
     * @method execute
     * @description Deletes a user with password verification
     * @param {object} db - The database
     * @returns {Promise<void>} - The result of the command
     * @throws {APIActorError} If the password is incorrect
     * @override
     * @async
     */
    async execute(db) {
        const verifyPassword = this.verifyPassword;

        await super.execute(db, [
            async (t, entity) => {
                const snapshot = await db.UserDescription.findOne({
                    where: { user_client_side_uuid: entity.client_side_uuid },
                    order: [["created_at", "DESC"]],
                    transaction: t
                });

                const isPasswordCorrect = await db.UserDescription.verifyPassword(snapshot.dataValues, verifyPassword);
                if (!isPasswordCorrect) {
                    throw new APIActorError("Invalid password", 400);
                }
            }
        ])
    }
}
