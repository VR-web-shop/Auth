import DTO from './DTO.js';

/**
 * @class CreateRequest
 * @classdesc DTO for access requests
 * @property {string} email
 * @property {string} password
 */
class CreateRequest extends DTO.DTOBaseClass {
    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an email
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body) {
        super(body, ['email', 'password'], ['email', 'password'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class RefreshRequest
 * @classdesc DTO for refresh access requests
 * @property {string} refresh_token
 */
class RefreshRequest extends DTO.DTOBaseClass {
    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain a refresh_token
     */
    constructor(body) {
        super(body, ['refresh_token'], ['refresh_token'], DTO.TYPES.REQUEST);
    }
}

export default {
    CreateRequest,
    RefreshRequest
}
