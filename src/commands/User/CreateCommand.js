import _CreateCommand from "../abstractions/CreateCommand.js";
import { Op } from "sequelize";

export default class CreateCommand extends _CreateCommand {
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
