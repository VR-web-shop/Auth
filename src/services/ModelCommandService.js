/**
 * @module services/ModelCommandService
 * @description Service for executing ModelCommand instances
 * @requires module:db/models
 * @requires module:services/errors/ServiceArgumentError
 * @requires module:commands/abstractions/ModelCommand
 */
import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ModelCommand from '../commands/abstractions/ModelCommand.js';
import _db from '../../db/models/index.cjs';

/**
 * @class
 * @classdesc Service for executing ModelCommand instances
 * @returns {object} - An object containing the invoke method
 */
export default class ModelCommandService {

    /**
     * @constructor
     * @param {object} db - The database connection
     */
    constructor(db = _db) {
        if (typeof db !== 'object')
            throw new ServiceArgumentError('db must be an object');

        /**
         * Executes the provided command
         * @param {ModelCommand} command - The command to execute
         * @returns {Promise<void>} - The result of the command
         */
        this.invoke = async (command) => {
            if (!(command instanceof ModelCommand))
                throw new ServiceArgumentError('Command must be an instance of ModelCommand');

            await command.execute(db);
        };
    }
}
