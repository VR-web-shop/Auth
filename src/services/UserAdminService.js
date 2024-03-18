import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import ServiceEntityDuplicateValueError from "./errors/ServiceEntityDuplicateValueError.js";
import Permission from "../models/Permission.js";
import PermissionResponse from "../dtos/PermissionResponse.js";
import RolePermission from "../models/RolePermission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import UserRequest from "../dtos/UserRequest.js";
import UserResponse from "../dtos/UserResponse.js";

/**
 * @function find
 * @description Find a user by UUID
 * @param {UserRequest.AdminFindRequest} adminFindRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminFindRequest is not provided
 * @throws {ServiceEntityNotFoundError} If user is not found
 */
async function find(adminFindRequest) {
    if (!adminFindRequest instanceof UserRequest.AdminFindRequest) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of UserRequest.AdminFindRequest');
    }

    const { uuid } = adminFindRequest
    const user = await User.findOne({ where: { uuid } })
    
    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    return new UserResponse(user.dataValues)
}

async function findPermissions(adminFindRequest) {
    if (!adminFindRequest instanceof UserRequest.AdminFindRequest) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of UserRequest.AdminFindRequest');
    }

    const { uuid } = adminFindRequest
    const user = await User.findOne({ where: { uuid } })
    
    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    const rolePermission = await RolePermission.findAll({where: { role_name: user.role_name }, include: Permission})
    const permissionResponses = rolePermission.map(rp => new PermissionResponse(rp.dataValues.Permission.dataValues))

    return permissionResponses
}

/**
 * @function findAll
 * @description Find all users
 * @param {UserRequest.AdminFindAllRequest} adminFindAllRequest
 * @returns {Promise<UserResponse[]>} response
 */
async function findAll(adminFindRequest) {
    if (!(adminFindRequest instanceof UserRequest.AdminFindAllRequest)) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of UserRequest.AdminFindAllRequest');
    }

    let { page, limit } = adminFindRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const users = await User.findAll({ offset, limit })
    const count = await User.count()
    const pages = Math.ceil(count / limit)
    const userResponses = users.map(user => new UserResponse(user.dataValues))

    return { users: userResponses, pages }
}

/**
 * @function create
 * @description Create a new user
 * @param {UserRequest.AdminCreateRequest} adminCreateRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminCreateRequest is not provided
 * @throws {ServiceEntityDuplicateValueError} If email is already in use
 * @throws {ServiceEntityNotFoundError} If role is not found
 */
async function create(adminCreateRequest) {
    if (!adminCreateRequest instanceof UserRequest.AdminCreateRequest) {
        throw new ServiceArgumentError('adminCreateRequest must be an instance of UserRequest.AdminCreateRequest');
    }

    const { email, password, role_name } = adminCreateRequest

    if (await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    const roleExists = await Role.findOne({ where: { name: role_name } })
    if (!roleExists) {
        throw new ServiceEntityNotFoundError('Role not found')
    }

    const user = await User.create({ email, password, role_name })
    
    return new UserResponse(user.dataValues)
}

/**
 * @function update
 * @description Update a user
 * @param {UserRequest.AdminUpdateRequest} adminUpdateRequest
 * @returns {Promise<UserResponse>} response
 * @throws {ServiceArgumentError} If adminUpdateRequest is not provided
 * @throws {ServiceEntityNotFoundError} If user is not found
 */
async function update(adminUpdateRequest) {
    if (!adminUpdateRequest instanceof UserRequest.AdminUpdateRequest) {
        throw new ServiceArgumentError('adminUpdateRequest must be an instance of UserRequest.AdminUpdateRequest');
    }

    const { uuid, email, password, role_name } = adminUpdateRequest
    const user = await User.findOne({ where: { uuid } })

    if (!user) {
        throw new ServiceEntityNotFoundError('User not found')
    }

    if (email && await User.findOne({ where: { email } })) {
        throw new ServiceEntityDuplicateValueError('Email already in use')
    }

    if (role_name && !await Role.findOne({ where: { name: role_name } })) {
        throw new ServiceEntityNotFoundError('Role not found')
    }

    if (email) user.email = email
    if (password) user.password = password
    if (role_name) user.role_name = role_name
    await user.save()
    
    return new UserResponse(user.dataValues)
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
        throw new ServiceEntityNotFoundError('User not found')
    }

    await user.destroy()
}

export default {
    find,
    findPermissions,
    findAll,
    create,
    update,
    destroy,
    UserRequest
}
