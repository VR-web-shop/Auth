import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceIncorectPasswordError from "./errors/ServiceIncorectPasswordError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import db from "../../db/models/index.cjs";
import AuthJWT from "../jwt/AuthenticateJWT.js";
import ModelQueryService from "./ModelQueryService.js";
import ReadUserCollectionQuery from "../queries/User/ReadCollectionQuery.js";
import ReadRolePermissionCollectionQuery from "../queries/RolePermission/ReadCollectionQuery.js";

const queryService = new ModelQueryService()

async function create(email, password) {
    if (typeof email !== 'string') {
        throw new ServiceArgumentError('Email must be a string')
    }
    
    if (typeof password !== 'string') {
        throw new ServiceArgumentError('Password must be a string')
    }
    const permissionInclude = { 
        model: 'Permission', 
        as: 'permissions',
        include: [
            { model: 'PermissionDescription' },
            { model: 'PermissionRemoved' }
        ] 
    }

    const include = [{
        model: 'Role', 
        as: 'roles',
        include: [
            { model: 'RoleDescription' },
            permissionInclude
        ]
    }]

    const { rows } = await queryService.invoke(new ReadUserCollectionQuery({ 
        // Note: active_email has a unique contraint, where email does not
        // because it is only to record the email that has been used for the account.
        where: `userdescriptions.active_email = '${email}'`
    }, null, true))

    if (rows.length === 0) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (rows.length > 1) {
        throw new Error('Multiple users found')
    }
    
    const { rows: permissionRows } = await queryService.invoke(new ReadRolePermissionCollectionQuery({ 
        where: `rolepermissions.role_client_side_uuid = '${rows[0].role_client_side_uuid}'`,
    }, null, true))
    
    const entity = rows[0]
    const permissionNames = permissionRows.map(p => p.permission_name)

    if (!await db.UserDescription.verifyPassword(entity, password)) {
        throw new ServiceIncorectPasswordError('Invalid password')
    }
    
    return AuthJWT.NewAuthentication(entity.client_side_uuid, permissionNames)
}

async function refresh(refresh_token) {
    const access_token = await AuthJWT.RefreshAuthentication(refresh_token)
    console.log(await AuthJWT.RefreshAuthentication(refresh_token))
    return { access_token }
}

export default {
    create,
    refresh,
}
