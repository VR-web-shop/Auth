import DTOArgumentError from './errors/DTOArgumentError.js';
import DTOResponseParameterError from './errors/DTOResponseParameterError.js';

/**
 * @class RoleResponse
 * @classdesc DTO for Role model
 * @property {string} name
 * @property {string} description
 */
export default class RoleResponse {

    /**
     * @constructor
     * @param {Role} role
     * @throws {DTOArgumentError} If role is not provided
     * @throws {DTOResponseParameterError} If role does not contain a name
     * @throws {DTOResponseParameterError} If role does not contain a description
     */
    constructor(role) {
        if (!role) {
            throw new DTOArgumentError('Role is required');
        }

        if (!role.name) {
            throw new DTOResponseParameterError('Role name is required');
        }

        if (!role.description) {
            throw new DTOResponseParameterError('Role description is required');
        }

        this.name = role.name;
        this.description = role.description;
    }
}
