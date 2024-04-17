import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import PermissionDTO from "../../dtos/Permission.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            PermissionDTO, 
            "Permission", 
            "PermissionDescription", 
            "PermissionRemoved"
        );
    }
}
