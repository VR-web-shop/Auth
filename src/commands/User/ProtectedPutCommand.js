/**
 * @module commands/User/ProtectedPutCommand
 * @description A module that provides a command for updating a user with password verification
 * @requires module:commands/User/PutCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import _PutCommand from "./PutCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ProtectedPutCommand
 * @classdesc A command for updating a user with password verification
 * @extends commands/User/PutCommand
 */
export default class ProtectedPutCommand extends _PutCommand {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} params - The user parameters
     * @param {string} params.verifyPassword - The password to verify
     * @param {string} [params.role_client_side_uuid] - The role client side UUID
     * @throws Will throw an error if verifyPassword is not provided
     */
    constructor(clientSideUUID, params) {
        super(clientSideUUID, params);

        if (!this.params.verifyPassword) {
            throw new Error("verifyPassword is required");
        }
    }

    /**
     * @method execute
     * @description Updates a user with password verification
     * @param {object} db - The database
     * @returns {Promise<void>} - The result of the command
     * @throws {APIActorError} If the password is incorrect
     * @override
     * @async
     */
    async execute(db) {
        const verifyPassword = this.params.verifyPassword;

        await super.execute(db, 
            [async (t, entity, params) => {
                if (!params.role_client_side_uuid) {
                    const snapshot = await db.UserDescription.findOne({
                        where: { user_client_side_uuid: entity.client_side_uuid } ,
                        order: [ [ 'created_at', 'DESC' ] ],
                    }, { transaction: t });
                    params.role_client_side_uuid = snapshot.role_client_side_uuid;
                }
            }],
            [async (t, entity, snapshot) => {
                const isPasswordCorrect = await db.UserDescription.verifyPassword(snapshot.dataValues, verifyPassword);
                if (!isPasswordCorrect) {
                    throw new APIActorError("Invalid password", 400);
                }
            }]
        )
    }
}
