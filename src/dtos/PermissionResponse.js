import DTOArgumentError from './errors/DTOArgumentError.js';
import DTOResponseParameterError from './errors/DTOResponseParameterError.js';

/**
 * @class PermissionResponse
 * @classdesc DTO for Permission model
 * @property {string} name
 * @property {string} description
 */
export default class PermissionResponse {

    /**
     * @constructor
     * @param {Permission} permission
     * @throws {DTOArgumentError} If permission is not provided
     * @throws {DTOResponseParameterError} If permission does not contain a name
     * @throws {DTOResponseParameterError} If permission does not contain a description
     */
    constructor(permission) {
        if (!permission) {
            throw new DTOArgumentError('permission is required');
        }

        const { name, description } = permission;

        if (!name) {
            throw new DTOResponseParameterError('permission name is required');
        }

        if (!description) {
            throw new DTOResponseParameterError('permission description is required');
        }

        this.name = name;
        this.description = description;
    }
}
