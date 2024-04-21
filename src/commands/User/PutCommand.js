import _PutCommand from "../abstractions/PutCommand.js";
import { Op } from "sequelize";

export default class PutCommand extends _PutCommand {
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

        this.clientSideUUID = clientSideUUID;
    }

    async execute(db) {
        // Ensure to set the active email used to enforce unique constraint
        this.params.active_email = this.params.email;

        await super.execute(db, { 
            beforeTransactions: [
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
            ]
        })
    }
}
