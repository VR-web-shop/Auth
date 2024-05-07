/**
 * @module queries/RolePermission/ReadOneQuery
 * @description A module for reading a single role permission
 * @requires module:queries/abstractions/ReadOneQuery
 * @requires module:dtos/RolePermission
 */
import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import RolePermissionDTO from "../../dtos/RolePermission.js";

/**
 * @class ReadOneQuery
 * @classdesc A query for reading a single role permission
 * @extends ReadOneQuery
 */
export default class ReadOneQuery extends _ReadOneQuery {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} [additionalParams={}] - Additional query parameters
     */
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            RolePermissionDTO, 
            "RolePermission", 
            null, 
            "RolePermissionRemoved",
            "role_permission_client_side_uuid",
            additionalParams
        );
    }
}
