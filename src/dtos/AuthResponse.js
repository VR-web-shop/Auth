import DTOArgumentError from './errors/DTOArgumentError.js';

/**
 * @class AuthenticationResponse
 * @classdesc DTO for authentication response
 * @property {string} access_token
 */
export default class AuthenticationResponse {

    /**
     * @constructor
     * @param {string} access_token
     * @throws {DTOArgumentError} If access_token is not provided
     */
    constructor(access_token) {
        if (!access_token) {
            throw new DTOArgumentError('Access token is required');
        }

        this.access_token = access_token;
    }

    static fromJSON(json) {
        return new AuthenticationResponse(json.access_token);
    }
}
