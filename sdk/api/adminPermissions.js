import PermissionRequest from '../../src/dtos/PermissionRequest.js';
import PermissionResponse from '../../src/dtos/PermissionResponse.js';
import crudAPI from '../crudAPI.js';

const FOREIGN_KEY = 'name';
const ENTITIES_KEY = 'permissions';
const ENDPOINT_SINGLE = 'admin/permission';
const ENDPOINT_MULTIPLE = 'admin/permissions';
const REQUEST = PermissionRequest;
const RESPONSE = PermissionResponse;

async function find(findRequest) {
    return crudAPI.find(
        findRequest, 
        FOREIGN_KEY, 
        REQUEST.FindRequest, 
        RESPONSE, 
        ENDPOINT_SINGLE
    );
}

async function findAll(findAllRequest) {
    return crudAPI.findAll(
        findAllRequest,
        ENTITIES_KEY,
        REQUEST.FindAllRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

async function create(createRequest) {
    return crudAPI.create(
        createRequest, 
        REQUEST.CreateRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

async function update(updateRequest) {
    return crudAPI.update(
        updateRequest, 
        REQUEST.UpdateRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

async function destroy(deleteRequest) {
    return crudAPI.destroy(
        deleteRequest, 
        REQUEST.DeleteRequest, 
        ENDPOINT_MULTIPLE
    );
}

export default {
    find,
    findAll,
    create,
    update,
    destroy
}
