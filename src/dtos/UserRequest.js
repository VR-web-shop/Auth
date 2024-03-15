import DTOArgumentError from './errors/DTOArgumentError.js';
import DTORequestParameterError from './errors/DTORequestParameterError.js';

/**
 * @class CreateRequest
 * @classdesc DTO for user creation requests
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
 * @class UpdateRequest
 * @classdesc DTO for user update requests
 * @property {string} uuid
 * @property {string} email
 * @property {string} password
 * @property {string} newPassword
 */
class UpdateRequest {

    /**
     * @constructor
     * @param {object} body
     * @param {string} uuid
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTOArgumentError} If body does not contain an uuid
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body, uuid) {
        if (!body) {
            throw new DTOArgumentError('Body is required');
        }

        if (!uuid) {
            throw new DTOArgumentError('UUID is required');
        }

        const { email, password, newPassword } = body;

        if (!password) {
            throw new DTORequestParameterError('Password is required');
        }

        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.newPassword = newPassword;
    }
}

/**
 * @class DeleteRequest
 * @classdesc DTO for user delete requests
 * @property {string} uuid
 * @property {string} password
 */
class DeleteRequest {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTOArgumentError} If uuid is not provided
     * @throws {DTORequestParameterError} If body does not contain a password
     */
    constructor(body, uuid) {
        if (!body) {
            throw new DTOArgumentError('Body is required');
        }

        if (!uuid) {
            throw new DTOArgumentError('uuid is required');
        }

        const { password } = body;

        if (!password) {
            throw new DTORequestParameterError('Password is required');
        }

        this.uuid = uuid;
        this.password = password;
    }
}

/**
 * @class AdminCreateRequest
 * @classdesc DTO for admin user find requests
 * @property {string} uuid
 */
class AdminFindRequest {

    /**
     * @constructor
     * @param {object} params
     * @throws {DTOArgumentError} If params is not provided
     * @throws {DTORequestParameterError} If params does not contain an uuid
     */
    constructor(params) {
        if (!params) {
            throw new DTOArgumentError('params is required');
        }

        const { uuid } = params;
        if (!uuid) {
            throw new DTORequestParameterError('uuid is required');
        }

        this.uuid = uuid;
    }
}

/**
 * @class AdminCreateRequest
 * @classdesc DTO for admin user creation requests
 * @property {string} email
 * @property {string} password
 * @property {string} RoleName
 */
class AdminCreateRequest extends CreateRequest {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an email
     * @throws {DTORequestParameterError} If body does not contain a password
     * @throws {DTORequestParameterError} If body does not contain a role_name
     */
    constructor(body) {
        super(body);

        const { role_name } = body;
        if (!role_name) {
            throw new DTORequestParameterError('Role name is required');
        }

        this.RoleName = role_name;
    }
}

/**
 * @class AdminUpdateRequest
 * @classdesc DTO for admin user update requests
 * @property {string} uuid
 * @property {string} email
 * @property {string} password
 * @property {string} RoleName
 */
class AdminUpdateRequest {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an uuid
     */
    constructor(body) {
        if (!body) {
            throw new DTOArgumentError('Body is required');
        }

        const { uuid, email, password, role_name } = body;

        if (!uuid) {
            throw new DTORequestParameterError('UUID is required');
        }

        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.RoleName = role_name;
    }
}

/**
 * @class AdminDeleteRequest
 * @classdesc DTO for admin user delete requests
 * @property {string} uuid
 */
class AdminDeleteRequest {

    /**
     * @constructor
     * @param {object} body
     * @throws {DTOArgumentError} If body is not provided
     * @throws {DTORequestParameterError} If body does not contain an uuid
     */
    constructor(body) {
        if (!body) {
            throw new DTOArgumentError('body is required');
        }

        const { uuid } = body;

        if (!uuid) {
            throw new DTORequestParameterError('UUID is required');
        }

        this.uuid = uuid;
    }
}

export default {
    CreateRequest,
    UpdateRequest,
    DeleteRequest,
    AdminFindRequest,
    AdminCreateRequest,
    AdminUpdateRequest,
    AdminDeleteRequest
}
