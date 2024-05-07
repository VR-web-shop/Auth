/**
 * @module services/ModelQueryService
 * @description Service for executing ModelQuery instances
 * @requires module:db/models
 * @requires module:services/errors/ServiceArgumentError
 * @requires module:queries/abstractions/ModelQuery
 */
import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ModelQuery from "../queries/abstractions/ModelQuery.js";
import _db from '../../db/models/index.cjs';

/**
 * @class
 * @classdesc Service for executing ModelQuery instances
 * @returns {object} - An object containing the invoke method
 */
export default class ModelQueryService {
    /**
     * @constructor
     * @param {object} db - The database connection
     */
    constructor(db = _db) {
        if (typeof db !== 'object')
            throw new ServiceArgumentError('db must be an object');

        /**
         * Executes the provided query
         * @param {ModelQuery} query - The query to execute
         * @returns {Promise<object>} - The result of the query
         */
        this.invoke = async (query) => {
            if (!(query instanceof ModelQuery))
                throw new ServiceArgumentError('Query must be an instance of ModelQuery');

            return await query.execute(db);
        };
    }
}
