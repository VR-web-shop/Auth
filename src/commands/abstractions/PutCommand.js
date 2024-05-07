/**
 * @module commands/abstractions/PutCommand
 * @description A module that provides a command for putting a model instance
 * @requires module:commands/abstractions/ModelCommand
 * @requires module:controllers/api/errors/APIActorError
 */
import ModelCommand from "../abstractions/ModelCommand.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class PutCommand
 * @classdesc A command for putting a model instance
 * @extends commands/abstractions/ModelCommand
 */
export default class PutCommand extends ModelCommand {

    /**
     * @constructor
     * @param {string} pk - The primary key value
     * @param {object} params - The model instance parameters
     * @param {string} pkName - The primary key name
     * @param {string} fkName - The foreign key name
     * @param {string[]} casKeys - The keys to use for CAS calculation
     * @param {string} modelName - The model name
     * @param {string} snapshotName - The snapshot model name
     * @param {string} tombstoneName - The tombstone model name
     * @throws {Error} If pk is not provided or not a string
     * @throws {Error} If params is not provided or not an object
     * @throws {Error} If pkName is not provided or not a string
     * @throws {Error} If fkName is not provided or not a string
     * @throws {Error} If casKeys is not provided or not an array
     * @throws {Error} If modelName is not provided or not a string
     * @throws {Error} If snapshotName is not provided or not a string
     * @throws {Error} If tombstoneName is not provided or not a string
     */
    constructor(pk, params, pkName, fkName, casKeys, modelName, snapshotName, tombstoneName) {
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

        if (!fkName || typeof fkName !== "string") {
            throw new Error("fkName is required and must be a string");
        }

        if (!casKeys || !Array.isArray(casKeys)) {
            throw new Error("casKeys is required and must be an array");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (!snapshotName || typeof snapshotName !== "string") {
            throw new Error("snapshotName is required and must be a string");
        }

        if (!tombstoneName || typeof tombstoneName !== "string") {
            throw new Error("tombstoneName is required and must be a string");
        }

        this.pk = pk;
        this.params = params;
        this.pkName = pkName;
        this.fkName = fkName;
        this.casKeys = casKeys;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
    }

    /**
     * @function execute
     * @description Puts a model instance
     * @param {object} db - The database connection
     * @param {object} [options={}] - The options for the command
     * @param {object} [options.beforeTransactions] - The transactions to run before the main transaction
     * @param {object} [options.afterTransactions] - The transactions to run after the main transaction
     * @returns {Promise<void>} - The result of the command
     * @throws {Error} If db is not provided or not an object
     * @throws {APIActorError} If an error occurs while putting the entity
     * @async
     * @override
     */
    async execute(db, options={}) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        if (!options || typeof options !== "object") {
            throw new Error("options is required and must be an object");
        }

        const pk = this.pk;
        const pkName = this.pkName;
        const fkName = this.fkName;
        const casKeys = this.casKeys;
        const params = this.params;
        const modelName = this.modelName;
        const snapshotName = this.snapshotName;
        const tombstoneName = this.tombstoneName;
        const time = {
            created_at: new Date(),
            updated_at: new Date(),
        }

        try {
            await db.sequelize.transaction(async t => {
                let entity = await db[modelName].findOne(
                    { 
                        where: { [pkName]: pk },
                        include: [
                            { 
                                model: db[tombstoneName], 
                                limit: 1,
                                order: [["created_at", "DESC"]] 
                            },
                            { 
                                model: db[snapshotName], 
                                limit: 1,
                                order: [["created_at", "DESC"]] 
                            }
                        ]
                    },
                    { transaction: t }
                );

                if (!entity) {
                    entity = await db[modelName].create(
                        { [pkName]: pk }, 
                        { transaction: t }
                    );
                } else if (entity[`${tombstoneName}s`].length > 0) {
                    // Undo remove
                    await db[tombstoneName].destroy(
                        { where: { [fkName]: pk } },
                        { transaction: t }
                    );
                }

                const snapshots = entity[`${snapshotName}s`];
                if (snapshots && snapshots.length > 0) {
                    const description = snapshots[0];
                    const inputString = casKeys.map(key => params[key]).join(", ");
                    const currentString = casKeys.map(key => description[key]).join(", ");
                    const inputCAS = PutCommand.calculateCAS(inputString);
                    const currentCAS = PutCommand.calculateCAS(currentString);
                    if (currentCAS === inputCAS) return; // No changes
                }

                if (options.beforeTransactions) {
                    for (const transaction of options.beforeTransactions) {
                        await transaction(t, entity, params);
                    }
                }

                const snapshot = await db[snapshotName].create(
                    { [fkName]: pk, ...params, ...time }, 
                    { transaction: t }
                );

                if (options.afterTransactions) {
                    for (const transaction of options.afterTransactions) {
                        await transaction(t, entity, snapshot);
                    }
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

            throw new APIActorError("An error occurred while putting an entity", 500);
        }
    }

    /**
     * @function calculateCAS
     * @description Calculates the CAS value
     * @param {object} params - The parameters to calculate the CAS value
     * @returns {string} - The CAS value
     * @static
     */
    static calculateCAS = (params) => {
        const base64 = Buffer.from(`${params}`).toString("base64");
        return Buffer.from(base64).toString("base64");
    }
}
