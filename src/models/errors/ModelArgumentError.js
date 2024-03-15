
/**
 * @class ModelArgumentError
 * @description An error indicating that the arguments provided to a 
 * Model function are invalid.
 * @extends Error
 */
class ModelArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ModelArgumentError';
    }
}

export default ModelArgumentError;
