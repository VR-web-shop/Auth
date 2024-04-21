import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import UserDTO from "../../dtos/User.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}, includePassword=false) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            (entity) => UserDTO(entity, includePassword),
            "User", 
            "UserDescription", 
            "UserRemoved",
            "user_client_side_uuid",
            additionalParams
        );
    }
}
