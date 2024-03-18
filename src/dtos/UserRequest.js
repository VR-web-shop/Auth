import DTO from './DTO.js';

/**
 * @class CreateRequest
 * @classdesc DTO for user creation requests
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
 * @class UpdateRequest
 * @classdesc DTO for user update requests
 * @property {string} uuid
 * @property {string} email
 * @property {string} password
 * @property {string} new_password
 */
class UpdateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body) {
        super(body, ['email', 'password', 'new_password'], ['password'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class DeleteRequest
 * @classdesc DTO for user delete requests
 * @property {string} password
 */
class DeleteRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body) {
        super(body, ['password'], ['password'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class AdminFindRequest
 * @classdesc DTO for admin user find requests
 * @property {string} uuid
 */
class AdminFindRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} params
     * @throws {DTOArgumentError} If params is not provided
     * @throws {DTORequestParameterError} If params does not contain an uuid
     */
    constructor(params) {
        super(params, ['uuid'], ['uuid'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class AdminFindAllRequest
 * @classdesc DTO for admin user find all requests
 * @property {number} page
 * @property {number} limit
 */
class AdminFindAllRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} params
     * @throws {DTOArgumentError} If params is not provided
     * @throws {DTORequestParameterError} If params does not contain an uuid
     */
    constructor(params) {
        super(params, ['page', 'limit'], ['limit'], DTO.TYPES.REQUEST);

        this.limit = parseInt(this.limit);
        if (this.limit < 1) {
            throw new DTORequestParameterError('Limit must be greater than 0');
        }

        if (this.page) {
            this.page = parseInt(this.page);
        }

        if (this.page && this.page < 1) {
            throw new DTORequestParameterError('Page must be greater than 0');
        }
    }
}

/**
 * @class AdminCreateRequest
 * @classdesc DTO for admin user creation requests
 * @property {string} email
 * @property {string} password
 * @property {string} role_name
 */
class AdminCreateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an email
     * @throws {DTORequestParameterError} If body does not contain a password
     * @throws {DTORequestParameterError} If body does not contain a role_name
     */
    constructor(body) {
        super(
            body, 
            ['email', 'password', 'role_name'], 
            ['email', 'password', 'role_name'], 
            DTO.TYPES.REQUEST
        );
    }
}

/**
 * @class AdminUpdateRequest
 * @classdesc DTO for admin user update requests
 * @property {string} uuid
 * @property {string} email
 * @property {string} password
 * @property {string} role_name
 */
class AdminUpdateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an uuid
     */
    constructor(body) {
        super(body, ['uuid', 'email', 'password', 'role_name'], ['uuid'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class AdminDeleteRequest
 * @classdesc DTO for admin user delete requests
 * @property {string} uuid
 */
class AdminDeleteRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an uuid
     */
    constructor(body) {
        super(body, ['uuid'], ['uuid'], DTO.TYPES.REQUEST);
    }
}

export default {
    CreateRequest,
    UpdateRequest,
    DeleteRequest,
    AdminFindRequest,
    AdminFindAllRequest,
    AdminCreateRequest,
    AdminUpdateRequest,
    AdminDeleteRequest
}
