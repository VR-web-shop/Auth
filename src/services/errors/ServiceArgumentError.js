/**
 * @module services/errors/ServiceArgumentError
 * @description Custom error for service argument errors
 */

/**
 * @class ServiceArgumentError
 * @classdesc Error indicating that a service argument is incorrect
 * @extends Error
 */
class ServiceArgumentError extends Error {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg)
        this.name = 'ServiceArgumentError'
    }
}

export default ServiceArgumentError;
