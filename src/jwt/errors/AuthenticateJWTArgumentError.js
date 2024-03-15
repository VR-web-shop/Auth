
/**
 * @class AuthenticateJWTArgumentError
 * @description An error indicating that the arguments provided to a 
 * AuthenticateJWT function are invalid.
 * @extends Error
 */
class AuthenticateJWTArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticateJWTArgumentError';
    }
}

export default AuthenticateJWTArgumentError;
