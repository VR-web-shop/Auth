import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import ServiceEntityDuplicateValueError from "./errors/ServiceEntityDuplicateValueError.js";
import ServiceEntityNotDeletableError from "./errors/ServiceEntityNotDeletableError.js";
import Role from "../models/Role.js";
import RoleRequest from "../dtos/RoleRequest.js";
import RoleResponse from "../dtos/RoleResponse.js";

/**
 * @function find
 * @description Find a role by name
 * @param {RoleRequest.AdminFindRequest} adminFindRequest
 * @returns {Promise<RoleResponse>} response
 * @throws {ServiceArgumentError} If adminFindRequest is not provided
 * @throws {ServiceEntityNotFoundError} If role is not found
 */
async function find(adminFindRequest) {
    if (!adminFindRequest instanceof RoleRequest.AdminFindRequest) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of RoleRequest.AdminFindRequest');
    }

    const { name } = adminFindRequest
    const role = await Role.findOne({ where: { name } })
    
    if (!role) {
        throw new ServiceEntityNotFoundError('Role not found')
    }

    return new RoleResponse(role.dataValues)
}

/**
 * @function findAll
 * @description Find all roles
 * @param {RoleRequest.AdminFindAllRequest} adminFindAllRequest
 * @returns {Promise<RoleResponse[]>} response
 * @throws {ServiceArgumentError} If adminFindRequest is not provided
 */
async function findAll(adminFindRequest) {
    if (!(adminFindRequest instanceof RoleRequest.AdminFindAllRequest)) {
        throw new ServiceArgumentError('adminFindRequest must be an instance of RoleRequest.AdminFindAllRequest');
    }

    let { page, limit } = adminFindRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const roles = await Role.findAll({ offset, limit })
    const count = await Role.count()
    const pages = Math.ceil(count / limit)
    const roleResponses = roles.map(role => new RoleResponse(role.dataValues))

    return { roles: roleResponses, pages }
}

/**
 * @function create
 * @description Create a new role
 * @param {RoleRequest.AdminCreateRequest} adminCreateRequest
 * @returns {Promise<RoleResponse>} response
 * @throws {ServiceArgumentError} If adminCreateRequest is not provided
 */
async function create(adminCreateRequest) {
    if (!adminCreateRequest instanceof RoleRequest.AdminCreateRequest) {
        throw new ServiceArgumentError('adminCreateRequest must be an instance of RoleRequest.AdminCreateRequest');
    }

    const { name, description } = adminCreateRequest

    if (await Role.findOne({ where: { name } })) {
        throw new ServiceEntityDuplicateValueError('Name already in use')
    }

    const role = await Role.create({ name, description })
    
    return new RoleResponse(role.dataValues)
}

/**
 * @function update
 * @description Update a role
 * @param {RoleRequest.AdminUpdateRequest} adminUpdateRequest
 * @returns {Promise<RoleResponse>} response
 * @throws {ServiceArgumentError} If adminUpdateRequest is not provided
 * @throws {ServiceEntityNotFoundError} If role is not found
 */
async function update(adminUpdateRequest) {
    if (!adminUpdateRequest instanceof RoleRequest.AdminUpdateRequest) {
        throw new ServiceArgumentError('adminUpdateRequest must be an instance of RoleRequest.AdminUpdateRequest');
    }

    const { name, description } = adminUpdateRequest
    const role = await Role.findOne({ where: { name } })

    if (!role) {
        throw new ServiceEntityNotFoundError('Role not found')
    }

    if (description) role.description = description
    await role.save()
    
    return new RoleResponse(role.dataValues)
}

/**
 * @function destroy
 * @description Delete a role
 * @param {RoleRequest.AdminDeleteRequest} adminDeleteRequest
 * @returns {Promise<RoleResponse>} response
 * @throws {ServiceArgumentError} If adminDeleteRequest is not provided
 * @throws {ServiceEntityNotFoundError} If role is not found
 */
async function destroy(adminDeleteRequest) {
    if (!adminDeleteRequest instanceof RoleRequest.AdminDeleteRequest) {
        throw new ServiceArgumentError('adminDeleteRequest must be an instance of RoleRequest.AdminDeleteRequest');
    }

    const { name } = adminDeleteRequest
    const role = await Role.findOne({ where: { name } })

    if (!role) {
        throw new ServiceEntityNotFoundError('Role not found')
    }

    if (!role.is_user_defined) {
        throw new ServiceEntityNotDeletableError('Only user defined roles can be deleted')
    }

    await role.destroy()
}

export default {
    find,
    findAll,
    create,
    update,
    destroy,
    RoleRequest
}
