import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import RolePermissionDTO from "../../dtos/RolePermission.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            RolePermissionDTO, 
            "RolePermission", 
            null, 
            "RolePermissionRemoved"
        );
    }
}
