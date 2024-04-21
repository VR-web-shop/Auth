import ModelQuery from "./ModelQuery.js";
import { Op, QueryTypes } from "sequelize";

export default class ReadCollectionQuery extends ModelQuery {
    constructor(
        options = {}, 
        dto, 
        modelName, 
        snapshotName = null, 
        tombstoneName = null,
        snapshotOptions = {},
        fkName = null,
        pkName = null
    ) {
        super();
        
        if (typeof options !== "object") {
            throw new Error("Options must be an object");
        }

        if (!dto || typeof dto !== "function") {
            throw new Error("dto is required and must be a function");
        }

        if (!modelName || typeof modelName !== "string") {
            throw new Error("modelName is required and must be a string");
        }

        if (snapshotName && typeof snapshotName !== "string") {
            throw new Error("if using snapshots, snapshotName is required and must be a string");
        }

        if (tombstoneName && typeof tombstoneName !== "string") {
            throw new Error("if using tombstones, tombstoneName is required and must be a string");
        }

        this.options = options;
        this.dto = dto;
        this.modelName = modelName;
        this.snapshotName = snapshotName;
        this.tombstoneName = tombstoneName;
        this.snapshotOptions = snapshotOptions;
        this.fkName = fkName;
        this.pkName = pkName;
    }

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const options = this.options;

        let limit, page, offset;

        if (options.limit) {
            limit = options.limit;

            if (limit < 1) {
                throw new APIActorError("limit must be greater than 0", 400);
            }
        }

        if (options.page) {
            page = options.page;
            
            if (page < 1) {
                throw new APIActorError("page must be greater than 0", 400);
            }

            if (!limit) {
                throw new APIActorError("limit is required when using page", 400);
            }

            offset = (page - 1) * limit;
        }

        const mTable = `${this.modelName}s`;
        const sTable = this.snapshotName ? `${this.snapshotName}s` : null;
        const tTable = this.tombstoneName ? `${this.tombstoneName}s` : null;
        const fkName = this.fkName;
        const pkName = this.pkName;
        const where = options.where;

        const queryOptions = {
            limit, 
            offset, 
            mTable, 
            sTable, 
            tTable, 
            where, 
            fkName, 
            pkName, 
        }

        const replacements = {
            limit, 
            offset, 
        };

        if (options.where) {
            options.where.forEach(w => {
                replacements[w.table] = w.table;
                replacements[w.column] = w.column;
                replacements[w.key] = w.value;
            });
        }

        const selectSQL = ModelQuery.getSql({ prefix: "SELECT *", ...queryOptions });
        const countSQL = ModelQuery.getSql({ prefix: "SELECT COUNT(*)", ...queryOptions });
        const queryOpt = { type: QueryTypes.SELECT, replacements };

        const entities = await db.sequelize.query(selectSQL, queryOpt);
        const countRes = await db.sequelize.query(countSQL, queryOpt);

        const count = countRes[0]["COUNT(*)"];
        const rows = entities.map(entity => this.dto(entity));
        const result = { rows, count };

        if (page) {
            const pages = Math.ceil(count / limit);
            result.pages = pages;
        }

        return result;
    }
}
