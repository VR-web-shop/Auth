/**
 * @module queries/User/ReadOneQuery
 * @description A module for reading a single user
 * @requires module:queries/abstractions/ReadOneQuery
 * @requires module:dtos/User
 */
import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import UserDTO from "../../dtos/User.js";

/**
 * @class ReadOneQuery
 * @classdesc A query for reading a single user
 * @extends ReadOneQuery
 */
export default class ReadOneQuery extends _ReadOneQuery {

    /**
     * @constructor
     * @param {string} clientSideUUID - The client side UUID
     * @param {object} [additionalParams={}] - Additional query parameters
     * @param {boolean} [includePassword=false] - Whether to include the password in the DTO
     */
    constructor(clientSideUUID, additionalParams = {}, includePassword=false) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            (entity) => UserDTO(entity, includePassword),
            "User", 
            "UserDescription", 
            "UserRemoved",
            "user_client_side_uuid",
            additionalParams
        );
    }
}
