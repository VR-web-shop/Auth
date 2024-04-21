import ModelQuery from "./ModelQuery.js";
import APIActorError from "../../controllers/api/errors/APIActorError.js";
import { Op, QueryTypes } from "sequelize";

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

    async execute(db) {
        if (!db || typeof db !== "object") {
            throw new Error("db is required and must be an object");
        }

        const options = this.additionalParams;
        const dto = this.dto;
        const mTable = `${this.modelName}s`;
        const sTable = this.snapshotName ? `${this.snapshotName}s` : null;
        const tTable = this.tombstoneName ? `${this.tombstoneName}s` : null;
        const fkName = this.fkName;
        const pkName = this.pkName;
        const pk = this.pk;

        const sql = `
            SELECT * FROM ${mTable}
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
                    return ` LEFT JOIN ${include.model} ON ${include.model}.${include.fk} = ${mTable}.${pkName}` 
                }).join(" ") 
                : ""
            }
            WHERE ${mTable}.${pkName} = '${pk}'
            ${
                sTable
                ? ` AND ${sTable}.created_at = (SELECT MAX(created_at) FROM ${sTable} WHERE ${sTable}.${fkName} = ${mTable}.${pkName})`
                : ""
            }
            ${
                tTable 
                ? ` AND ${tTable}.${fkName} IS NULL`
                : ""
            }
            ${
                options.where 
                ? ` AND ${options.where}`
                : ""
            }
            LIMIT 1
        `;
        const entity = await db.sequelize.query(sql, { type: QueryTypes.SELECT });

        if (entity.length === 0) {
            throw new APIActorError("No Entity found", 404);
        }

        return dto(entity[0]);
    }
}
