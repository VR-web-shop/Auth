/**
 * @module commands/abstractions/CreateCommand
 * @description A module that provides a command for creating a model instance
 * @requires module:commands/abstractions/ModelCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class CreateCommand
 * @classdesc A command for creating a model instance
 * @extends commands/abstractions/ModelCommand
 */
export default class CreateCommand extends ModelCommand {

    /**
     * @constructor
     * @param {string} pk - The primary key value
     * @param {object} params - The model instance parameters
     * @param {string} pkName - The primary key name
     * @param {string} modelName - The model name
     * @param {string} [fkName=null] - The foreign key name
     * @param {string} [snapshotName=null] - The snapshot model name
     * @param {object} [snapshotParams=null] - The snapshot model parameters
     * @throws {Error} If pk is not provided or not a string
     * @throws {Error} If params is not provided or not an object
     * @throws {Error} If pkName is not provided or not a string
     * @throws {Error} If modelName is not provided or not a string
     * @throws {Error} If fkName is provided and not a string
     * @throws {Error} If snapshotName is provided and not a string
     * @throws {Error} If snapshotName is provided and fkName is not provided
     * @throws {Error} If snapshotName is provided and snapshotParams is not provided
     */
    constructor(pk, params, pkName, modelName, fkName = null, snapshotName = null, snapshotParams = null) {
        super();
        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!params || typeof params !== "object") {
            throw new Error("Params is required and must be an object");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (fkName && typeof fkName !== "string") {
            throw new Error("if fkName is provided, it must be a string");
        }

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if snapshotName is provided, it must be a string");
        }

        if (snapshotName && !fkName) {
            throw new Error("if snapshotName is provided, fkName must also be provided");
        }

        if (snapshotName && !snapshotParams) {
            throw new Error("if snapshotName is provided, snapshotParams must also be provided");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.modelName = modelName;
        this.fkName = fkName;
        this.snapshotName = snapshotName;
        this.snapshotParams = snapshotParams;
    }

    /**
     * @function execute
     * @description Creates a model instance
     * @param {object} db - The database connection
     * @throws {Error} If db is not provided or not an object
     * @throws {APIActorError} If the entity already exists
     * @throws {APIActorError} If an error occurs while creating the entity
     * @returns {Promise<void>} The result of the command
     * @async
     * @override
     */
    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const params = this.params;
        const modelName = this.modelName;
        const fkName = this.fkName;
        const snapshotName = this.snapshotName;
        const snapshotParams = this.snapshotParams;
        const time = {
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            await db.sequelize.transaction(async t => {
                const entity = await db[modelName].findOne(
                    { where: { [pkName]: pk } },
                    { transaction: t }
                );

                if (entity) {
                    throw new APIActorError(`Entity with ${pkName} ${pk} already exists`, 400);
                }

                await db[modelName].create(
                    { [pkName]: pk, ...params, ...time }, 
                    { transaction: t }
                );

                if (snapshotName && snapshotParams) {
                    await db[snapshotName].create(
                        { [fkName]: pk, ...snapshotParams, ...time }, 
                        { transaction: t }
                    );
                }
            });
        } catch (error) {
            console.log(error)
            
            if (error instanceof APIActorError) {
                throw error;
            }

            if (error.name === "SequelizeUniqueConstraintError") {
                const paths = error.errors.map(e => e.path).join(", ");
                throw new APIActorError(`The following fields must be unique: ${paths}`, 400);
            }

            throw new APIActorError("An error occurred while creating the entity", 500);
        }
    }
}
