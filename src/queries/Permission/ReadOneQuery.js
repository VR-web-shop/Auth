import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import PermissionDTO from "../../dtos/Permission.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(name) {
        super(
            name, 
            "name",
            PermissionDTO, 
            "Permission", 
            "PermissionDescription", 
            "PermissionRemoved"
        );
    }
}
