import DTO from './DTO.js';

/**
 * @class RoleResponse
 * @classdesc DTO for Role model
 * @property {string} name
 * @property {string} description
 * @property {boolean} is_user_defined
 */
const REQUIRED = ['name', 'description', 'is_user_defined'];
export default class RoleResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Role} role
     * @throws {DTOArgumentError} If role is not provided
     * @throws {DTOResponseParameterError} If role does not contain a name
     * @throws {DTOResponseParameterError} If role does not contain a description
     */
    constructor(role) {
        super(role, REQUIRED, REQUIRED, DTO.TYPES.RESPONSE);
    }
}
