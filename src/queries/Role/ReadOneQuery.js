import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import RolePermissionDTO from "../../dtos/RolePermission.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(id) {
        super(
            id, 
            "id",
            RolePermissionDTO, 
            "RolePermission", 
            null, 
            "RolePermissionRemoved"
        );
    }
}
