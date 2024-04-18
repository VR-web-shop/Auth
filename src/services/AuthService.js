import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceIncorectPasswordError from "./errors/ServiceIncorectPasswordError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";

import User, { verifyPassword } from "../models/User.js";
import Role from "../models/Role.js";
import RolePermission from "../models/RolePermission.js";
import Permission from "../models/Permission.js";
import PermissionResponse from "../dtos/PermissionResponse.js";

import AuthJWT from "../jwt/AuthenticateJWT.js";
import AuthRequest from "../dtos/AuthRequest.js";
import AuthResponse from "../dtos/Auth.js";

/**
 * @function create
 * @description Create a new authentication
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} response, refresh_token
 * @throws {ServiceArgumentError} If email or password is not a string
 * @throws {ServiceEntityNotFoundError} If user not found
 * @throws {ServiceIncorectPasswordError} If password is incorrect
 */
async function create(email, password) {
    if (typeof email !== 'string') {
        throw new ServiceArgumentError('Email must be a string')
    }
    
    if (typeof password !== 'string') {
        throw new ServiceArgumentError('Password must be a string')
    }

    const user = await User.findOne({ where: { email }, include: Role })
    
    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (!await verifyPassword(password, user)) {
        throw new ServiceIncorectPasswordError('Invalid password')
    }

    const rolePermission = await RolePermission.findAll({where: { role_name: user.role_name }, include: Permission})
    const permissionResponses = rolePermission.map(rp => new PermissionResponse(rp.dataValues.Permission.dataValues))
    const { access_token, refresh_token } = AuthJWT.NewAuthentication(user.uuid, permissionResponses)
    const response = new AuthResponse({access_token})

    return {response, refresh_token}
}

/**
 * @function refresh
 * @description Refresh a new authentication
 * @param {AuthRequest.RefreshRequest} refreshRequest
 * @returns {Promise<AuthResponse>} response
 * @throws {ServiceArgumentError} If refreshRequest is not an instance of AuthRequest.RefreshRequest
 * @throws {AuthJWT.InvalidRefreshTokenError} If the refresh token is invalid
 */
async function refresh(refresh_token) {
    if (!(refreshRequest instanceof AuthRequest.RefreshRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    const { refresh_token } = refreshRequest
    const access_token = await AuthJWT.RefreshAuthentication(refresh_token)
    const reponse = new AuthResponse({access_token})

    return reponse
}

export default {
    create,
    refresh,
    AuthRequest
}
