import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import RoleDTO from "../../dtos/Role.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            RoleDTO, 
            "Role", 
            "RoleDescription", 
            "RoleRemoved",
            "role_client_side_uuid",
            additionalParams
        );
    }
}
