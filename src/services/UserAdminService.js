import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFound from "./errors/ServiceEntityNotFound.js";
import ServiceEntityDuplicateValueError from "./errors/ServiceEntityDuplicateValueError.js";
import User from "../models/User.js";
import { ROLES } from "../models/Role.js";
import UserRequest from "../dtos/UserRequest.js";
import UserResponse from "../dtos/UserResponse.js";

/**
 * @function find
 * @description Find a user by UUID
 * @param {UserRequest.AdminFindRequest} adminFindRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminFindRequest is not provided
 * @throws {ServiceEntityNotFound} If user is not found
 */
async function find(adminFindRequest) {
    if (!adminFindRequest instanceof UserRequest.AdminFindRequest) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of UserRequest.AdminFindRequest');
    }

    const { uuid } = adminFindRequest
    const user = await User.findOne({ where: { uuid } })
    
    if (!user) {
        throw new ServiceEntityNotFound('User not found')
    }

    return new UserResponse(user)
}

/**
 * @function findAll
 * @description Find all users
 * @returns {Promise<UserResponse[]>} response
 */
async function findAll() {
    const users = await User.findAll()

    return users.map(user => new UserResponse(user))
}

/**
 * @function create
 * @description Create a new user
 * @param {UserRequest.AdminCreateRequest} adminCreateRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminCreateRequest is not provided
 */
async function create(adminCreateRequest) {
    if (!adminCreateRequest instanceof UserRequest.AdminCreateRequest) {
        throw new ServiceArgumentError('adminCreateRequest must be an instance of UserRequest.AdminCreateRequest');
    }

    const { email, password, role_name } = adminCreateRequest

    if (await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    if (!Object.values(ROLES).includes(role_name)) {
        throw new ServiceEntityNotFound('Role not found')
    }

    const user = await User.create({ email, password, role_name })
    
    return new UserResponse(user)
}

/**
 * @function update
 * @description Update a user
 * @param {UserRequest.AdminUpdateRequest} adminUpdateRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminUpdateRequest is not provided
 * @throws {ServiceEntityNotFound} If user is not found
 */
async function update(adminUpdateRequest) {
    if (!adminUpdateRequest instanceof UserRequest.AdminUpdateRequest) {
        throw new ServiceArgumentError('adminUpdateRequest must be an instance of UserRequest.AdminUpdateRequest');
    }

    const { uuid, email, password, role_name } = adminUpdateRequest
    const user = await User.findOne({ where: { uuid } })

    if (!user) {
        throw new ServiceEntityNotFound('User not found')
    }

    if (email && await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    if (role_name && !Object.values(ROLES).includes(role_name)) {
        throw new ServiceEntityNotFound('Role not found')
    }

    if (email) user.email = email
    if (password) user.password = password
    if (role_name) user.role_name = role_name
    await user.save()
    
    return new UserResponse(user)
}

/**
 * @function destroy
 * @description Delete a user
 * @param {UserRequest.AdminDeleteRequest} adminDeleteRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminDeleteRequest is not provided
 */
async function destroy(adminDeleteRequest) {
    if (!adminDeleteRequest instanceof UserRequest.AdminDeleteRequest) {
        throw new ServiceArgumentError('adminDeleteRequest must be an instance of UserRequest.AdminDeleteRequest');
    }

    const { uuid } = adminDeleteRequest
    const user = await User.findOne({ where: { uuid } })

    if (!user) {
        throw new ServiceEntityNotFound('User not found')
    }

    await user.destroy()

    return new UserResponse(user)
}

export default {
    find,
    findAll,
    create,
    update,
    destroy,
    UserRequest
}
