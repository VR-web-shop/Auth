import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFoundError from "./errors/ServiceEntityNotFoundError.js";
import ServiceEntityDuplicateValueError from "./errors/ServiceEntityDuplicateValueError.js";
import ServiceEntityNotDeletableError from "./errors/ServiceEntityNotDeletableError.js";
import Permission from "../models/Permission.js";
import PermissionRequest from "../dtos/PermissionRequest.js";
import PermissionResponse from "../dtos/PermissionResponse.js";

/**
 * @function find
 * @description Find a permission by name
 * @param {PermissionRequest.FindRequest} findRequest
 * @returns {Promise<PermissionResponse>} response
 * @throws {ServiceArgumentError} If findRequest is not provided
 * @throws {ServiceEntityNotFoundError} If permission is not found
 */
async function find(findRequest) {
    if (!findRequest instanceof PermissionRequest.FindRequest) {
        throw new ServiceArgumentError('findRequest must be an instance of PermissionRequest.FindRequest');
    }

    const { name } = findRequest
    const permission = await Permission.findOne({ where: { name } })
    
    if (!permission) {
        throw new ServiceEntityNotFoundError('Permission not found')
    }

    return new PermissionResponse(permission.dataValues)
}

/**
 * @function findAll
 * @description Find all permissions
 * @param {PermissionRequest.FindAllRequest} findAllRequest
 * @returns {Promise<PermissionResponse[]>} response
 * @throws {ServiceArgumentError} If findRequest is not provided
 */
async function findAll(findAllRequest) {
    if (!(findAllRequest instanceof PermissionRequest.FindAllRequest)) {
        throw new ServiceArgumentError('findAllRequest must be an instance of PermissionRequest.FindAllRequest');
    }

    let { page, limit } = findAllRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const permissions = await Permission.findAll({ offset, limit })
    const count = await Permission.count()
    const pages = Math.ceil(count / limit)
    const permissionResponses = permissions.map(permission => new PermissionResponse(permission.dataValues))

    return { permissions: permissionResponses, pages }
}

/**
 * @function create
 * @description Create a new permission
 * @param {PermissionRequest.CreateRequest} createRequest
 * @returns {Promise<PermissionResponse>} response
 * @throws {ServiceArgumentError} If createRequest is not provided
 */
async function create(createRequest) {
    if (!createRequest instanceof PermissionRequest.CreateRequest) {
        throw new ServiceArgumentError('createRequest must be an instance of PermissionRequest.CreateRequest');
    }

    const { name, description } = createRequest

    if (await Permission.findOne({ where: { name } })) {
        throw new ServiceEntityDuplicateValueError('Name already in use')
    }

    const permission = await Permission.create({ name, description })
    
    return new PermissionResponse(permission.dataValues)
}

/**
 * @function update
 * @description Update a permission
 * @param {PermissionRequest.UpdateRequest} updateRequest
 * @returns {Promise<PermissionResponse>} response
 * @throws {ServiceArgumentError} If updateRequest is not provided
 * @throws {ServiceEntityNotFoundError} If permission is not found
 */
async function update(updateRequest) {
    if (!updateRequest instanceof PermissionRequest.UpdateRequest) {
        throw new ServiceArgumentError('updateRequest must be an instance of PermissionRequest.UpdateRequest');
    }

    const { name, description } = updateRequest
    const permission = await Permission.findOne({ where: { name } })

    if (!permission) {
        throw new ServiceEntityNotFoundError('Permission not found')
    }

    if (description) permission.description = description
    await permission.save()

    return new PermissionResponse(permission.dataValues)
}

/**
 * @function destroy
 * @description Delete a permission
 * @param {PermissionRequest.DeleteRequest} deleteRequest
 * @returns {Promise<PermissionResponse>} response
 * @throws {ServiceArgumentError} If deleteRequest is not provided
 * @throws {ServiceEntityNotFoundError} If permission is not found
 */
async function destroy(deleteRequest) {
    if (!deleteRequest instanceof PermissionRequest.DeleteRequest) {
        throw new ServiceArgumentError('deleteRequest must be an instance of PermissionRequest.DeleteRequest');
    }

    const { name } = deleteRequest
    const permission = await Permission.findOne({ where: { name } })

    if (!permission) {
        throw new ServiceEntityNotFoundError('Permission not found')
    }

    if (!permission.is_user_defined) {
        throw new ServiceEntityNotDeletableError('Only user defined permissions can be deleted')
    }

    await permission.destroy()
}

export default {
    find,
    findAll,
    create,
    update,
    destroy,
    PermissionRequest
}
