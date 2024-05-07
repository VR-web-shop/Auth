/**
 * @module commands/abstractions/DeleteCommand
 * @description A module that provides a command for deleting a model instance
 * @requires module:commands/abstractions/ModelCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class DeleteCommand
 * @classdesc A command for deleting a model instance
 * @extends commands/abstractions/ModelCommand
 */
export default class DeleteCommand extends ModelCommand {

    /**
     * @constructor
     * @param {string} pk - The primary key value
     * @param {string} pkName - The primary key name
     * @param {string} fkName - The foreign key name
     * @param {string} modelName - The model name
     * @param {string} tombstoneName - The tombstone model name
     * @throws {Error} If pk is not provided or not a string
     * @throws {Error} If pkName is not provided or not a string
     * @throws {Error} If fkName is not provided or not a string
     * @throws {Error} If modelName is not provided or not a string
     * @throws {Error} If tombstoneName is not provided or not a string
     */
    constructor(pk, pkName, fkName, modelName, tombstoneName) {
        super();

        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!fkName || typeof fkName !== "string") {
            throw new Error("fkName is required and must be a string");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (!tombstoneName || typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
        }

        this.pk = pk;
        this.pkName = pkName;
        this.fkName = fkName;
        this.modelName = modelName;
        this.tombstoneName = tombstoneName;
    }

    /**
     * @function execute
     * @description Deletes a model instance
     * @param {object} db - The database connection
     * @param {object} [options={}] - The options for the command
     * @param {Array<Function>} [options.afterTransactions] - The transactions to run after the main transaction
     * @returns {Promise<void>} - A promise that resolves when the command is complete
     * @throws {Error} If db is not provided or not an object
     * @throws {APIActorError} If no entity is found
     * @throws {APIActorError} If an error occurs while deleting the entity
     * @returns {Promise<void>} The result of the command
     * @async
     * @override
     */
    async execute(db, options={}) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const fkName = this.fkName;
        const modelName = this.modelName;
        const tombstoneName = this.tombstoneName;
        const time = {
            deleted_at: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            await db.sequelize.transaction(async t => {
                const entity = await db[modelName].findOne(
                    { 
                        where: { [pkName]: pk },
                        include: [{ model: db[tombstoneName], limit: 1 }]
                    },
                    { transaction: t }
                );
    
                if (!entity || entity[`${tombstoneName}s`].length > 0) {
                    throw new APIActorError("No entity found", 404);
                }

                await db[tombstoneName].create(
                    { [fkName]: pk, ...time },
                    { transaction: t }
                );

                if (options.afterTransactions) {
                    for (const transaction of options.afterTransactions) {
                        await transaction(t, entity);
                    }
                }
            });
        } catch (error) {
            console.log(error)
            
            if (error instanceof APIActorError) {
                throw error;
            }

            throw new APIActorError("An error occurred while deleting the entity", 500);
        }
    }
}
