import _DeleteCommand from "./DeleteCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class ProtectedDeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID, verifyPassword) {
        super(clientSideUUID);

        if (!verifyPassword) {
            throw new Error("verifyPassword is required");
        }

        this.verifyPassword = verifyPassword;
    }

    async execute(db) {
        const verifyPassword = this.verifyPassword;
        console.log("ProtectedDeleteCommand", verifyPassword);
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
