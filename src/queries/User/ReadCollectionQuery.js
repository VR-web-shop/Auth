/**
 * @module queries/User/ReadCollectionQuery
 * @description A module for reading a collection of users
 * @requires module:queries/abstractions/ReadCollectionQuery
 * @requires module:dtos/User
 */
import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import UserDTO from "../../dtos/User.js";

/**
 * @class ReadCollectionQuery
 * @classdesc A query for reading a collection of users
 * @extends ReadCollectionQuery
 */
export default class ReadCollectionQuery extends _ReadCollectionQuery {

    /**
     * @constructor
     * @param {object} options - The query options
     * @param {object} snapshotOptions - The snapshot options
     * @param {boolean} includePassword - Whether to include the password in the DTO
     */
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
