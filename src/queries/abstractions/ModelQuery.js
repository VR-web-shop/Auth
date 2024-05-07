/**
 * @module queries/abstractions/ModelQuery
 * @description An abstraction for querying a model
 * @requires module:sequelize
 */
import { Op } from "sequelize";

/**
 * @class
 * @classdesc An abstraction for querying a model
 * @abstract
 */
export default class ModelQuery {

    /**
     * @function execute
     * @description Executes the query
     * @param {object} db - The database connection
     * @returns {Promise<object>} - The result of the query
     * @abstract
     * @async
     * @throws {Error} Method not implemented
     */
    async execute(db) {
        throw new Error("Method not implemented");
    }

    /**
     * @function getSqlOperator
     * @description Gets the SQL operator
     * @param {string} operator - The operator
     * @returns {string} - The SQL operator
     * @static
     * @throws {Error} Operator not supported
     */
    static getSqlOperator = (operator) => {
        let sqlOperator;

        if (operator === Op.eq) sqlOperator = "=";
        else if (operator === Op.gt) sqlOperator = ">";
        else if (operator === Op.lt) sqlOperator = "<";
        else if (operator === Op.gte) sqlOperator = ">=";
        else if (operator === Op.lte) sqlOperator = "<=";
        else if (operator === Op.ne) sqlOperator = "!=";
        else if (operator === Op.like) sqlOperator = "LIKE";
        else if (operator === Op.in) sqlOperator = "IN";
        else if (operator === Op.notIn) sqlOperator = "NOT IN";
        else {
            throw new Error(`Operator ${operator} not supported`);
        }

        return sqlOperator;
    }

    /**
     * @function getSqlForWhereOption
     * @description Gets the SQL for the where option
     * @param {array} whereOption - The where option
     * @returns {string} - The SQL for the where option
     * @static
     */
    static getSqlForWhereOption = (whereOption) => {
        return whereOption
            ? whereOption.map((where, index) => {
                const prefix = index > 0 ? "AND" : "";
                const operator = ModelQuery.getSqlOperator(where.operator);

                return ` ${prefix} ${where.table} . ${where.column} ${operator} :${where.key}`
            }).join(" ")
            : ""
    }

    /**
     * @function getSql
     * @description Gets the SQL for the query
     * @param {object} options - The options for the query
     * @param {number} options.limit - The limit for the query
     * @param {number} options.offset - The offset for the query
     * @param {string} options.mTable - The main table
     * @param {string} options.sTable - The snapshot table
     * @param {string} options.tTable - The tombstone table
     * @param {array} options.where - The where option
     * @param {string} options.fkName - The foreign key name
     * @param {string} options.pkName - The primary key name
     * @param {string} options.prefix - The prefix for the query
     * @returns {string} - The SQL for the query
     * @static
     */
    static getSql = (options={}) => {
        let { limit, offset, mTable, sTable, tTable, where, fkName, pkName, prefix } = options;

        return `
            ${prefix} FROM ${mTable}
            ${
                // Left join the latest created snapshot
                sTable 
                ? ` LEFT JOIN ${sTable} ON ${sTable} . ${fkName} = ${mTable} . ${pkName}`
                : ""
            }
            ${
                // Left join the latest created tombstone
                tTable 
                ? ` LEFT JOIN ${tTable} ON ${tTable} . ${fkName} = ${mTable} . ${pkName}`
                : ""
            }

            ${
                sTable
                ? ` WHERE ${sTable} . created_at = (
                        SELECT MAX(created_at) FROM ${sTable} 
                        WHERE ${sTable} . ${fkName} = ${mTable} . ${pkName}
                    )`
                : ""
            }
            ${
                tTable 
                ? ` ${sTable ? "AND" : "WHERE"} ${tTable} . ${fkName} IS NULL`
                : ""
            }
            ${
                where 
                ? ` ${tTable || sTable ? "AND" : "WHERE"}`
                : ""
            }

            ${ModelQuery.getSqlForWhereOption(where)}

            ORDER BY ${mTable} . created_at DESC

            ${limit ? ` LIMIT :limit` : ""}
            ${offset ? ` OFFSET :offset` : ""}
        `;
    }
}
