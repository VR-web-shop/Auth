'use strict';

/**
 * @class DTOArgumentError
 * @classdesc Error indicating that a DTO's argument is incorrect
 * @extends Error
 */
class DTOArgumentError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'DTOArgumentError';
    }
}

/**
 * @class APIActorError
 * @classdesc Error indicating that an error occurred because of an API actor
 * did not provide valid parameters when interacting with an API endpoint.
 * Possible reasons include:
 * - Not providing the correct keys
 * - Providing keys with undefined or null values when they are required
 * - Lookups for non existing entities
 * - Provided the wrong password in a login request
 * @extends Error
 * @param {string} msg - The error message
 * @param {number} statusCode - The HTTP status code to be sent back to the API actor
 */
class APIActorError extends Error {
    constructor(msg, statusCode) {
        super(msg);
        this.name = 'APIActorError';
        this.statusCode = statusCode;
    }
}

/**
 * @class DTORequestParameterError
 * @classdesc Error indicating that a request DTO's parameter is incorrect
 * @extends APIActorError
 */
class DTORequestParameterError extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 400);
        this.name = 'DTORequestParameterError';
    }
}

/**
 * @class AccessRequest
 * @classdesc DTO for access requests
 * @property {string} email
 * @property {string} password
 */
let CreateRequest$1 = class CreateRequest {

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
};

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

var AuthRequest = {
    CreateRequest: CreateRequest$1,
    RefreshRequest
};

/**
 * @class AuthenticationResponse
 * @classdesc DTO for authentication response
 * @property {string} access_token
 */
class AuthenticationResponse {

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
}

/**
 * @class DTOResponseParameterError
 * @classdesc Error indicating that a response DTO's parameter is incorrect
 * @extends Error
 */
class DTOResponseParameterError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'DTOResponseParameterError';
    }
}

/**
 * @class RoleResponse
 * @classdesc DTO for Role model
 * @property {string} name
 */
class RoleResponse {

    /**
     * @constructor
     * @param {Role} role
     * @throws {DTOArgumentError} If role is not provided
     * @throws {DTOResponseParameterError} If role does not contain a name
     */
    constructor(role) {
        if (!role) {
            throw new DTOArgumentError('Role is required');
        }

        if (!role.name) {
            throw new DTOResponseParameterError('Role name is required');
        }

        this.name = role.name;
    }
}

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

var UserRequest = {
    CreateRequest,
    UpdateRequest,
    DeleteRequest,
    AdminFindRequest,
    AdminCreateRequest,
    AdminUpdateRequest,
    AdminDeleteRequest
};

/**
 * @class UserResponse
 * @classdesc DTO for User
 * @property {string} uuid
 * @property {string} email
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} role_name
 */
class UserResponse {

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

        this.uuid = user.uuid;
        this.email = user.email;
        this.created_at = user.createdAt;
        this.updated_at = user.updatedAt;
        this.role_name = user.RoleName;
    }
}

var contract_api = {
    dtos: {
        AuthRequest,
        AuthResponse: AuthenticationResponse,
        RoleResponse,
        UserRequest,
        UserResponse
    }
};

module.exports = contract_api;
