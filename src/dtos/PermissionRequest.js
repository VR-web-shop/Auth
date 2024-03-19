import DTO from './DTO.js';

/**
 * @class FindRequest
 * @classdesc DTO for admin permission find requests
 * @property {string} name
 */
class FindRequest extends DTO.DTOBaseClass {

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
 * @class FindAllRequest
 * @classdesc DTO for admin permission find all requests
 * @property {number} page
 * @property {number} limit
 */
class FindAllRequest extends DTO.DTOBaseClass {

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
 * @class CreateRequest
 * @classdesc DTO for admin permission creation requests
 * @property {string} name
 * @property {string} description
 */
class CreateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an name
     * @throws {DTORequestParameterError} If body does not contain a description
     */
    constructor(body) {
        super(
            body, 
            ['name', 'description'], 
            ['name', 'description'], 
            DTO.TYPES.REQUEST
        );
    }
}

/**
 * @class UpdateRequest
 * @classdesc DTO for admin permission update requests
 * @property {string} name
 * @property {string} description
 */
class UpdateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an name
     */
    constructor(body) {
        super(body, ['name', 'description'], ['name'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class DeleteRequest
 * @classdesc DTO for admin permission delete requests
 * @property {string} name
 */
class DeleteRequest extends DTO.DTOBaseClass {

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
    FindRequest,
    FindAllRequest,
    CreateRequest,
    UpdateRequest,
    DeleteRequest
}
