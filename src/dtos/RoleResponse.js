import DTOArgumentError from './errors/DTOArgumentError.js';
import DTOResponseParameterError from './errors/DTOResponseParameterError.js';

/**
 * @class RoleResponse
 * @classdesc DTO for Role model
 * @property {string} name
 */
export default class RoleResponse {

    /**
     * @constructor
     * @param {Role} role
     * @throws {DTOArgumentError} If role is not provided
     * @throws {DTOResponseParameterError} If role does not contain a name
     */
    constructor(role) {
        if (!role) {
            throw new DTOArgumentError('Role is required');
        }

        if (!role.name) {
            throw new DTOResponseParameterError('Role name is required');
        }

        this.name = role.name;
    }
}
