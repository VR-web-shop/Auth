import DTO from './DTO.js';
/**
 * @class UserResponse
 * @classdesc DTO for User
 * @property {string} uuid
 * @property {string} email
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} role_name
 */
const REQUIRED = ['uuid', 'email', 'created_at', 'updated_at', 'role_name'];
export default class UserResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {User} user
     * @throws {DTOArgumentError} If user is not provided
     * @throws {DTOResponseParameterError} If user does not contain a uuid
     * @throws {DTOResponseParameterError} If user does not contain an email
     * @throws {DTOResponseParameterError} If user does not contain a created_at
     * @throws {DTOResponseParameterError} If user does not contain an updated_at
     * @throws {DTOResponseParameterError} If user does not contain a role_name
     */
    constructor(user) {
        super(user, REQUIRED, REQUIRED, DTO.TYPES.RESPONSE);
    }
}
