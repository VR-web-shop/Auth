import DTO from './DTO.js';

/**
 * @class AdminFindRequest
 * @classdesc DTO for admin role find requests
 * @property {string} name
 */
class AdminFindRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} params
     * @throws {DTOArgumentError} If params is not provided
     * @throws {DTORequestParameterError} If params does not contain an name
     */
    constructor(params) {
        super(params, ['name'], ['name'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class AdminFindAllRequest
 * @classdesc DTO for admin role find all requests
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
 * @classdesc DTO for admin role creation requests
 * @property {string} name
 * @property {string} description
 * @property {string[]} permissionNames
 */
class AdminCreateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an name
     * @throws {DTORequestParameterError} If body does not contain a description
     * @throws {DTORequestParameterError} If body does not contain a permissionNames
     */
    constructor(body) {
        super(
            body, 
            ['name', 'description', 'permissionNames'], 
            ['name', 'description', 'permissionNames'], 
            DTO.TYPES.REQUEST
        );
    }
}

/**
 * @class AdminUpdateRequest
 * @classdesc DTO for admin role update requests
 * @property {string} name
 * @property {string} description
 * @property {string[]} permissionNames
 */
class AdminUpdateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an name
     */
    constructor(body) {
        super(body, ['name', 'description', 'permissionNames'], ['name'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class AdminDeleteRequest
 * @classdesc DTO for admin role delete requests
 * @property {string} name
 */
class AdminDeleteRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an name
     */
    constructor(body) {
        super(body, ['name'], ['name'], DTO.TYPES.REQUEST);
    }
}

export default {
    AdminFindRequest,
    AdminFindAllRequest,
    AdminCreateRequest,
    AdminUpdateRequest,
    AdminDeleteRequest
}
