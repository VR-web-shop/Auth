/**
 * @module queries/Permission/ReadOneQuery
 * @description A module for reading a single permission
 * @requires module:queries/abstractions/ReadOneQuery
 * @requires module:dtos/Permission
 */
import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import PermissionDTO from "../../dtos/Permission.js";

/**
 * @class ReadOneQuery
 * @classdesc A query for reading a single permission
 * @extends ReadOneQuery
 */
export default class ReadOneQuery extends _ReadOneQuery {

    /**
     * @constructor
     * @param {string} name - The permission name
     * @param {object} [additionalParams={}] - Additional query parameters
     */
    constructor(name, additionalParams = {}) {
        super(
            name, 
            "name",
            PermissionDTO, 
            "Permission", 
            "PermissionDescription", 
            "PermissionRemoved",
            "permission_name",
            additionalParams
        );
    }
}
