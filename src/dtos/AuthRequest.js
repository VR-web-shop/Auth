import DTOArgumentError from './errors/DTOArgumentError.js';
import DTORequestParameterError from './errors/DTORequestParameterError.js';

/**
 * @class AccessRequest
 * @classdesc DTO for access requests
 * @property {string} email
 * @property {string} password
 */
class CreateRequest {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an email
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body) {
        if (!body) {
            throw new DTOArgumentError('Body is required');
        }

        const { email, password } = body;

        if (!email) {
            throw new DTORequestParameterError('Email is required');
        }

        if (!password) {
            throw new DTORequestParameterError('Password is required');
        }

        this.email = email;
        this.password = password;
    }
}

/**
 * @class RefreshRequest
 * @classdesc DTO for refresh access requests
 * @property {string} refresh_token
 */
class RefreshRequest {

    /**
     * @constructor
     * @param {object} cookies
     * @throws {DTOArgumentError} If cookies is not provided
     * @throws {DTORequestParameterError} If cookies does not contain a refresh_token
     */
    constructor(cookies) {
        if (!cookies) {
            throw new DTOArgumentError('Cookies are required');
        }

        const { refresh_token } = cookies;
        if (!refresh_token) {
            throw new DTORequestParameterError('Refresh token is required');
        }

        this.refresh_token = refresh_token;
    }
}

export default {
    CreateRequest,
    RefreshRequest
}
