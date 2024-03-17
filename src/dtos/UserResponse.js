import DTOArgumentError from './errors/DTOArgumentError.js';
import DTOResponseParameterError from './errors/DTOResponseParameterError.js';

/**
 * @class UserResponse
 * @classdesc DTO for User
 * @property {string} uuid
 * @property {string} email
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} role_name
 */
export default class UserResponse {

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
        if (!user) {
            throw new DTOArgumentError('User is required');
        }

        if (!user.uuid) {
            throw new DTOResponseParameterError('User uuid is required');
        }

        if (!user.email) {
            throw new DTOResponseParameterError('User email is required');
        }

        if (!user.created_at) {
            throw new DTOResponseParameterError('User created_at is required');
        }

        if (!user.updated_at) {
            throw new DTOResponseParameterError('User updated_at is required');
        }

        if (!user.role_name) {
            throw new DTOResponseParameterError('User role_name is required');
        }

        this.uuid = user.uuid
        this.email = user.email
        this.created_at = user.created_at
        this.updated_at = user.updated_at
        this.role_name = user.role_name
    }
}
