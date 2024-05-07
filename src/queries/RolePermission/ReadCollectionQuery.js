/**
 * @module queries/RolePermission/ReadCollectionQuery
 * @description A module for reading a collection of role permissions
 * @requires module:queries/abstractions/ReadCollectionQuery
 * @requires module:dtos/RolePermission
 */
import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import RolePermissionDTO from "../../dtos/RolePermission.js";

/**
 * @class ReadCollectionQuery
 * @classdesc A query for reading a collection of role permissions
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
