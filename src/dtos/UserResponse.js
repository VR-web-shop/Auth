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
     * @throws {DTOResponseParameterError} If user does not contain a createdAt
     * @throws {DTOResponseParameterError} If user does not contain an updatedAt
     * @throws {DTOResponseParameterError} If user does not contain a RoleName
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

        if (!user.createdAt) {
            throw new DTOResponseParameterError('User createdAt is required');
        }

        if (!user.updatedAt) {
            throw new DTOResponseParameterError('User updatedAt is required');
        }

        if (!user.RoleName) {
            throw new DTOResponseParameterError('User RoleName is required');
        }

        this.uuid = user.uuid
        this.email = user.email
        this.created_at = user.createdAt
        this.updated_at = user.updatedAt
        this.role_name = user.RoleName
    }
}
