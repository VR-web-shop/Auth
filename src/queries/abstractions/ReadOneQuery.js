/**
 * @module queries/abstractions/ReadOneQuery
 * @description A module that provides a query for reading a single entity
 * @requires module:sequelize
 * @requires module:queries/abstractions/ModelQuery
 * @requires module:controllers/api/errors/APIActorError
 */
import ModelQuery from "./ModelQuery.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";
import { Op, QueryTypes } from "sequelize";

/**
 * @class ReadOneQuery
 * @classdesc A query for reading a single entity
 * @extends ModelQuery
 * @param {string} pk - The primary key value
 * @param {string} pkName - The primary key name
 * @param {function} dto - The data transfer object
 * @param {string} modelName - The model name
 * @param {string} [snapshotName=null] - The snapshot name
 * @param {string} [tombstoneName=null] - The tombstone name
 * @param {string} [fkName=null] - The foreign key name
 * @param {object} [additionalParams={}] - Additional query parameters
 * @throws {Error} pk is required and must be a string
 * @throws {Error} pkName is required and must be a string
 * @throws {Error} dto is required and must be a function
 * @throws {Error} modelName is required and must be a string
 * @throws {Error} if using snapshots, snapshotName must be a string
 * @throws {Error} if using tombstones, tombstoneName must be a string
 * @throws {Error} if using tombstones, fkName is required
 * @throws {Error} additionalParams must be an object
 */
export default class ReadOneQuery extends ModelQuery {
    constructor(
        pk, 
        pkName, 
        dto, 
        modelName, 
        snapshotName = null, 
        tombstoneName = null,
        fkName = null,
        additionalParams = {}
    ) {
        super();

        if (!pk || typeof pk !== "string") {
            throw new Error("pk is required and must be a string");
        }

        if (!pkName || typeof pkName !== "string") {
            throw new Error("pkName is required and must be a string");
        }

        if (!dto || typeof dto !== "function") {
            throw new Error("dto is required and must be a function");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if using snapshots, snapshotName must be a string");
        }

        if (tombstoneName && typeof tombstoneName !== "string") {
            throw new Error("if using tombstones, tombstoneName must be a string");
        }

        if (tombstoneName && !fkName) {
            throw new Error("if using tombstones, fkName is required");
        }

        if (additionalParams && typeof additionalParams !== "object") {
            throw new Error("additionalParams must be an object");
        }

        this.pk = pk;
        this.pkName = pkName;
        this.dto = dto;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
        this.fkName = fkName;
        this.additionalParams = additionalParams;
    }

    /**
     * @function execute
     * @description Executes the query
     * @param {object} db - The database connection
     * @returns {Promise<object>} - The result of the query
     * @throws {Error} db is required and must be an object
     * @throws {APIActorError} No Entity found
     * @async
     * @override
     */
    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const mTable = `${this.modelName}s`;
        const sTable = this.snapshotName ? `${this.snapshotName}s` : null;
        const tTable = this.tombstoneName ? `${this.tombstoneName}s` : null;
        const fkName = this.fkName;
        const pkName = this.pkName;
        const limit = 1;
        const where = [{ 
            table: mTable, 
            column: pkName, 
            operator: Op.eq, 
            key: 'pk'
        }]

        const queryOptions = {
            mTable,
            sTable, 
            tTable, 
            fkName, 
            pkName, 
            limit,
            where
        }

        if (this.additionalParams.where) {
            this.additionalParams.where.forEach(w => {
                replacements[w.table] = w.table;
                replacements[w.column] = w.column;
                replacements[w.key] = w.value;
                queryOptions.where.push(w);
            });
        }

        const replacements = { pk: this.pk, limit: 1 };
        const selectSQL = ModelQuery.getSql({ prefix: "SELECT *", ...queryOptions });
        const selectOpt = { type: QueryTypes.SELECT, replacements }

        const entity = await db.sequelize.query(selectSQL, selectOpt);

        if (entity.length === 0) {
            throw new APIActorError("No Entity found", 404);
        }

        return this.dto(entity[0]);
    }
}
