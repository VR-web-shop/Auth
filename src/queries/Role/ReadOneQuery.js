/**
 * @module queries/Role/ReadOneQuery
 * @description A module for reading a single role
 * @requires module:queries/abstractions/ReadOneQuery
 * @requires module:dtos/Role
 */
import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import RoleDTO from "../../dtos/Role.js";

/**
 * @class ReadOneQuery
 * @classdesc A query for reading a single role
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
            RoleDTO, 
            "Role", 
            "RoleDescription", 
            "RoleRemoved",
            "role_client_side_uuid",
            additionalParams
        );
    }
}
