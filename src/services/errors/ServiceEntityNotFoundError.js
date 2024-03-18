import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ServiceEntityNotFoundError
 * @classdesc Error indicating that a service could not find the requested entity
 * @extends APIActorError
 */
class ServiceEntityNotFoundError extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 404)
        this.name = 'ServiceEntityNotFoundError'
    }
}

export default ServiceEntityNotFoundError;
