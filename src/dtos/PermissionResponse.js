import DTO from './DTO.js';

/**
 * @class PermissionResponse
 * @classdesc DTO for Permission model
 * @property {string} name
 * @property {string} description
 * @property {boolean} is_user_defined
 */
const REQUIRED = ['name', 'description', 'is_user_defined'];
export default class PermissionResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Permission} permission
     * @throws {DTOArgumentError} If permission is not provided
     * @throws {DTOResponseParameterError} If permission does not contain a name
     * @throws {DTOResponseParameterError} If permission does not contain a description
     * @throws {DTOResponseParameterError} If permission does not contain a is_user_defined
     */
    constructor(permission) {
        super(permission, REQUIRED, REQUIRED, DTO.TYPES.RESPONSE);
    }
}
