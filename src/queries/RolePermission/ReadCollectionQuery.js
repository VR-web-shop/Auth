import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import RolePermissionDTO from "../../dtos/RolePermission.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            RolePermissionDTO, 
            "RolePermission", 
            null, 
            "RolePermissionRemoved",
            null,
            "role_permission_client_side_uuid",
            "client_side_uuid"
        );
    }
}
