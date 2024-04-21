import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import UserDTO from "../../dtos/User.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}, includePassword=false) {
        super(
            options, 
            (entity) => UserDTO(entity, includePassword),
            "User", 
            "UserDescription", 
            "UserRemoved",
            snapshotOptions,
            "user_client_side_uuid",
            "client_side_uuid"
        );
    }
}
