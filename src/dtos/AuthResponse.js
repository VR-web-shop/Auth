import DTO from './DTO.js';

/**
 * @class AuthenticationResponse
 * @classdesc DTO for authentication response
 * @property {string} access_token
 */
export default class AuthenticationResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body does not contain an access_token
     */
    constructor(body) {
        super(body, ['access_token'], ['access_token'], DTO.TYPES.RESPONSE);
    }
}
