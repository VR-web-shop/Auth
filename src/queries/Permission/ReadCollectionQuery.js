/**
 * @module queries/Permission/ReadCollectionQuery
 * @description A module for reading a collection of permissions
 * @requires module:queries/abstractions/ReadCollectionQuery
 * @requires module:dtos/Permission
 */
import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import PermissionDTO from "../../dtos/Permission.js";

/**
 * @class ReadCollectionQuery
 * @classdesc A query for reading a collection of permissions
 * @extends ReadCollectionQuery
 */
export default class ReadCollectionQuery extends _ReadCollectionQuery {

    /**
     * @constructor
     * @param {object} options - The query options
     */
    constructor(options={}) {
        super(
            options, 
            PermissionDTO, 
            "Permission", 
            "PermissionDescription", 
            "PermissionRemoved",
            null,
            "permission_name",
            "name"
        );
    }
}
