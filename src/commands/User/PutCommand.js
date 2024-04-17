import _PutCommand from "../abstractions/PutCommand.js";

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
    }
}
