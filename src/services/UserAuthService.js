import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import ServiceEntityDuplicateValueError from "./errors/ServiceEntityDuplicateValueError.js";
import ServiceIncorectPasswordError from "./errors/ServiceIncorectPasswordError.js";
import Permission from "../models/Permission.js";
import PermissionResponse from "../dtos/PermissionResponse.js";
import RolePermission from "../models/RolePermission.js";
import { DEFAULT_ROLE } from "../models/Role.js";
import User, { verifyPassword } from "../models/User.js";
import AuthenticateJWT from "../jwt/AuthenticateJWT.js";
import AuthResponse from "../dtos/AuthResponse.js";
import UserRequest from "../dtos/UserRequest.js";
import UserResponse from "../dtos/UserResponse.js";

/**
 * @function find
 * @description Find a user
 * @param {string} uuid
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If uuid is not a string
 */
async function find(uuid) {
    if (typeof uuid !== 'string') {
        throw new ServiceArgumentError('Invalid uuid')
    }

    const user = await User.findOne({ where: { uuid } })

    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    return new UserResponse(user.dataValues)
}

/**
 * @function create
 * @description Create a new user
 * @param {UserRequest.CreateRequest} createRequest
 * @returns {Promise<Object>} response, refresh_token 
 * @throws {ServiceArgumentError} If createRequest is not an instance of UserRequest.CreateRequest
 */
async function create(createRequest) {
    if (!(createRequest instanceof UserRequest.CreateRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    const { email, password } = createRequest

    if (await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    const user = await User.create({ email, password, role_name: DEFAULT_ROLE })
    const rolePermission = await RolePermission.findAll({where: { role_name: DEFAULT_ROLE }, include: Permission})
    const permissionResponses = rolePermission.map(rp => new PermissionResponse(rp.dataValues.Permission.dataValues))
    const { access_token, refresh_token } = AuthenticateJWT.NewAuthentication(user.uuid, permissionResponses)
    const response = new AuthResponse({access_token})

    return { response, refresh_token }
}

/**
 * @function update
 * @description Update a user
 * @param {UserRequest.UpdateRequest} updateRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If updateRequest is not an instance of UserRequest.UpdateRequest
 * @throws {ServiceArgumentError} If uuid is not a string
 * @throws {ServiceEntityNotFoundError} If user not found
 * @throws {ServiceIncorectPasswordError} If password is incorrect
 */
async function update(updateRequest, uuid) {
    if (!(updateRequest instanceof UserRequest.UpdateRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    if (typeof uuid !== 'string') {
        throw new ServiceArgumentError('Invalid uuid')
    }

    const { email, password, new_password } = updateRequest
    const user = await User.findOne({ where: { uuid } })
    
    if (email && await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (!await verifyPassword(password, user)) {
        throw new ServiceIncorectPasswordError()
    }

    if (email && email !== user.email) user.email = email
    if (new_password) user.password = new_password
    await user.save()
    
    return new UserResponse(user.dataValues)
}

/**
 * @function destroy
 * @description Delete a user
 * @param {UserRequest.DeleteRequest} deleteRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If deleteRequest is not an instance of UserRequest.DeleteRequest
 * @throws {ServiceArgumentError} If uuid is not a string
 * @throws {ServiceEntityNotFoundError} If user not found
 * @throws {ServiceIncorectPasswordError} If password is incorrect
 */
async function destroy(deleteRequest, uuid) {
    if (!(deleteRequest instanceof UserRequest.DeleteRequest)) {
        throw new ServiceArgumentError('Invalid request')
    }

    if (typeof uuid !== 'string') {
        throw new ServiceArgumentError('Invalid uuid')
    }

    const { password } = deleteRequest
    const user = await User.findOne({ where: { uuid } })

    if(!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (!await verifyPassword(password, user)) {
        throw new ServiceIncorectPasswordError()
    }

    await user.destroy()
}

export default {
    find,
    create,
    update,
    destroy,
    UserRequest
}
