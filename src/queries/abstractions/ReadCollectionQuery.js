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
        const dto = this.dto;

        const limit = options.limit || 10;
        const page = options.page || 1;
        const offset = (page - 1) * limit;

        const mTable = `${this.modelName}s`;
        const sTable = this.snapshotName ? `${this.snapshotName}s` : null;
        const tTable = this.tombstoneName ? `${this.tombstoneName}s` : null;
        const fkName = this.fkName;
        const pkName = this.pkName;

        const sqlOptions = (prefix) => `
            ${prefix} FROM ${mTable}
            ${
                // Left join the latest created snapshot
                sTable 
                ? ` LEFT JOIN ${sTable} ON ${sTable}.${fkName} = ${mTable}.${pkName}`
                : ""
            }
            ${
                // Left join the latest created tombstone
                tTable 
                ? ` LEFT JOIN ${tTable} ON ${tTable}.${fkName} = ${mTable}.${pkName}`
                : ""
            }
            ${
                // Left join any other models
                options.include 
                ? options.include.map(include => {
                    return ` ${include}` 
                }).join(" ") 
                : ""
            }
            ${
                sTable
                ? ` WHERE ${sTable}.created_at = (SELECT MAX(created_at) FROM ${sTable} WHERE ${sTable}.${fkName} = ${mTable}.${pkName})`
                : ""
            }
            ${
                tTable 
                ? ` ${sTable ? "AND" : "WHERE"} ${tTable}.${fkName} IS NULL`
                : ""
            }
            ${
                options.where 
                ? ` ${tTable || sTable ? "AND" : "WHERE"} ${options.where}`
                : ""
            }

            ORDER BY ${mTable}.created_at DESC
            LIMIT ${limit} OFFSET ${offset} 
        `;

        const entities = await db.sequelize.query(`${sqlOptions("SELECT *")}`, { type: QueryTypes.SELECT });
        const countRes = await db.sequelize.query(`${sqlOptions("SELECT COUNT(*)")}`, { type: QueryTypes.SELECT });
        //console.log(entities, countRes);

        const count = countRes[0]["COUNT(*)"];
        const pages = Math.ceil(count / limit);
        const rows = entities.map(entity => dto(entity));

        return { rows, pages, count };
    }
}
