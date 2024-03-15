import User, { verifyPassword } from "../models/User.js";
import Role from "../models/Role.js";
import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceIncorectPasswordError from "./errors/ServiceIncorectPasswordError.js";
import ServiceEntityNotFound from "./errors/ServiceEntityNotFound.js";
import AuthJWT from "../jwt/AuthenticateJWT.js";
import AuthRequest from "../dtos/AuthRequest.js";
import AuthResponse from "../dtos/AuthResponse.js";

/**
 * @function create
 * @description Create a new authentication
 * @param {AuthRequest.CreateRequest} createRequest
 * @returns {Promise<Object>} response, refresh_token
 * @throws {ServiceArgumentError} If createRequest is not an instance of AuthRequest.CreateRequest
 * @throws {ServiceEntityNotFound} If user not found
 * @throws {ServiceIncorectPasswordError} If password is incorrect
 */
async function create(createRequest) {
    if (!(createRequest instanceof AuthRequest.CreateRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    const { email, password } = createRequest
    const user = await User.findOne({ where: { email }, include: Role })
    
    if (!user) {
        throw new ServiceEntityNotFound('User not found')
    }

    if (!await verifyPassword(password, user)) {
        throw new ServiceIncorectPasswordError('Invalid password')
    }

    const { access_token, refresh_token } = AuthJWT.NewAuthentication(user.uuid, user.RoleName)
    const response = new AuthResponse(access_token)

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
async function refresh(refreshRequest) {
    if (!(refreshRequest instanceof AuthRequest.RefreshRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    const { refresh_token } = refreshRequest
    const access_token = await AuthJWT.RefreshAuthentication(refresh_token)
    const reponse = new AuthResponse(access_token)

    return reponse
}

export default {
    create,
    refresh,
    AuthRequest
}
