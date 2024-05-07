/**
 * @module services/AuthService
 * @description Provides services for authentication
 * @requires module:sequelize
 * @requires module:db/models
 * @requires module:jwt/AuthenticateJWT
 * @requires module:services/ModelQueryService
 * @requires module:queries/User/ReadCollectionQuery
 * @requires module:queries/RolePermission/ReadCollectionQuery
 * @requires module:services/errors/ServiceArgumentError
 * @requires module:services/errors/ServiceIncorectPasswordError
 * @requires module:services/errors/ServiceEntityNotFoundError
 */

import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceIncorectPasswordError from "./errors/ServiceIncorectPasswordError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import db from "../../db/models/index.cjs";
import AuthJWT from "../jwt/AuthenticateJWT.js";
import ModelQueryService from "./ModelQueryService.js";
import ReadUserCollectionQuery from "../queries/User/ReadCollectionQuery.js";
import ReadRolePermissionCollectionQuery from "../queries/RolePermission/ReadCollectionQuery.js";
import { Op } from "sequelize";

const queryService = new ModelQueryService()

/**
 * @function create
 * @description Creates a new authentication token
 * @param {string} email - The email address of the user
 * @param {string} password - The password of the user
 * @returns {object} - The new authentication token
 * @throws {ServiceArgumentError} - If the email or password is not a string
 * @throws {ServiceEntityNotFoundError} - If the user is not found
 * @throws {ServiceIncorectPasswordError} - If the password is incorrect
 * @throws {Error} - If multiple users are found
 */
async function create(email, password) {
    if (typeof email !== 'string') {
        throw new ServiceArgumentError('Email must be a string')
    }

    if (typeof password !== 'string') {
        throw new ServiceArgumentError('Password must be a string')
    }

    const { rows } = await queryService.invoke(new ReadUserCollectionQuery({
        // Note: active_email has a unique contraint, where email does not
        // because it is only to record the email that has been used for the account.
        where: [{
            table: 'UserDescriptions',
            column: 'active_email',
            operator: Op.eq,
            key: 'active_email_value',
            value: email
        }]
    }, null, true))

    if (rows.length === 0) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (rows.length > 1) {
        throw new Error('Multiple users found')
    }

    const { rows: permissionRows } = await queryService.invoke(new ReadRolePermissionCollectionQuery({
        where: [{
            table: 'RolePermissions',
            column: 'role_client_side_uuid',
            operator: Op.eq,
            key: 'role_client_side_uuid_value',
            value: rows[0].role_client_side_uuid
        }]
    }, null, true))

    const entity = rows[0]
    const permissionNames = permissionRows.map(p => p.permission_name)

    if (!await db.UserDescription.verifyPassword(entity, password)) {
        throw new ServiceIncorectPasswordError('Invalid password')
    }

    return AuthJWT.NewAuthentication(entity.client_side_uuid, permissionNames)
}

/**
 * @function refresh
 * @description Refreshes the authentication token
 * @param {string} refresh_token - The refresh token
 * @returns {object} - The new access token
 */
async function refresh(refresh_token) {
    const access_token = await AuthJWT.RefreshAuthentication(refresh_token)
    return { access_token }
}

export default {
    create,
    refresh,
}
