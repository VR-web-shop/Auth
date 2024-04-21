import _DeleteCommand from "../abstractions/DeleteCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "name",
            "permission_name",
            "Permission",
            "PermissionRemoved"
        );
    }

    async execute(db) {
        await super.execute(db, { 
            afterTransactions: [
                async (db, entity) => {
                    if (entity.defined_by_system) {
                        throw new APIActorError(`Permission ${entity.name} is defined by the system and cannot be deleted`, 400);
                    }
                }
            ]
        })
    }
}
