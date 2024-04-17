import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import UserDTO from "../../dtos/User.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            UserDTO, 
            "User", 
            "UserDescription", 
            "UserRemoved"
        );
    }
}
