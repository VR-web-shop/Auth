/**
 * @module queries/Role/ReadCollectionQuery
 * @description A module for reading a collection of roles
 * @requires module:queries/abstractions/ReadCollectionQuery
 * @requires module:dtos/Role
 */
import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import RoleDTO from "../../dtos/Role.js";

/**
 * @class ReadCollectionQuery
 * @classdesc A query for reading a collection of roles
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
