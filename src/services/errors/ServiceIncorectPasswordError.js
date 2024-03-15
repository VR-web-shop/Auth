import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ServiceIncorectPasswordError
 * @classdesc Error indicating that the password is incorrect
 * @extends APIActorError
 * @param {string} msg - The error message
 * @param {number} statusCode - The HTTP status code to be sent
 */
class ServiceIncorectPasswordError extends APIActorError {

    /**
     * @constructor
     */
    constructor() {
        super('Incorect password', 401)
        this.name = 'ServiceIncorectPasswordError'
    }
}

export default ServiceIncorectPasswordError;
