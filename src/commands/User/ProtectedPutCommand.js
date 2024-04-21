import _PutCommand from "./PutCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class ProtectedPutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(clientSideUUID, params);

        if (!this.params.verifyPassword) {
            throw new Error("verifyPassword is required");
        }
    }

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
