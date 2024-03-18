import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ServiceEntityNotDeletableError
 * @classdesc Error indicating that a service could not delete the requested entity
 * because of a business rule
 * @extends APIActorError
 */
class ServiceEntityNotDeletableError extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 400)
        this.name = 'ServiceEntityNotDeletableError'
    }
}

export default ServiceEntityNotDeletableError;
