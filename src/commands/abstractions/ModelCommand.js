/**
 * @module commands/abstractions/ModelCommand
 * @description A module that provides a command for executing a model command
 */

/**
 * @class ModelCommand
 * @classdesc A command for executing a model command
 * @returns {object} - An object containing the execute method
 * @throws {Error} If the execute method is not implemented
 * @abstract
 */
export default class ModelCommand {

    /**
     * Executes the command
     * @param {object} db - The database connection
     * @param {object} [options={}] - The options for the command
     * @returns {Promise<void>} - The result of the command
     * @throws {Error} If the method is not implemented
     */
    async execute(db, options={}) {
        throw new Error("Method not implemented");
    }
}
