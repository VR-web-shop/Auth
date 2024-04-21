import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import RoleDTO from "../../dtos/Role.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            RoleDTO, 
            "Role", 
            "RoleDescription", 
            "RoleRemoved",
            null,
            "role_client_side_uuid",
            "client_side_uuid"
        );
    }
}
