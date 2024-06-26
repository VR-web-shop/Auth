/**
 * @module jwt/errors/InvalidRefreshTokenError
 * @description Custom error for invalid refresh token errors
 * @requires module:jwt/errors/APIActorError
 */
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class InvalidRefreshTokenError
 * @description If this error is thrown, the provided refresh token is invalid.
 * @extends APIActorError
 */
class InvalidRefreshTokenError extends APIActorError {

    /**
     * @constructor
     */
    constructor() {
        super('Invalid Refresh Token', 401);
        this.name = 'InvalidRefreshTokenError';
    }
}

export default InvalidRefreshTokenError;
