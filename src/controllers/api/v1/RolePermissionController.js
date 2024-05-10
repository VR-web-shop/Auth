/**
 * @module controllers/api/v1/RolePermissionController
 * @description A module that provides a controller for role permissions
 * @requires module:express
 * @requires module:jwt/MiddlewareJWT
 * @requires module:controllers/api/errors/APIActorError
 * @requires module:queries/RolePermission/ReadOneQuery
 * @requires module:queries/RolePermission/ReadCollectionQuery
 * @requires module:commands/RolePermission/CreateCommand
 * @requires module:commands/RolePermission/DeleteCommand
 * @requires module:services/ModelCommandService
 * @requires module:services/ModelQueryService
 */
import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/RolePermission/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/RolePermission/ReadCollectionQuery.js";
import CreateCommand from "../../../commands/RolePermission/CreateCommand.js";
import DeleteCommand from "../../../commands/RolePermission/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/role_permissions')
    /**
     * @openapi
     * '/api/v1/admin/role_permissions':
     *  get:
     *     tags:
     *       - Role Permission Admin Controller
     *     summary: Fetch all role permissions
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: query
     *        name: page
     *        required: false
     *        schema:
     *         type: integer
     *      - in: query
     *        name: limit
     *        required: true
     *        schema:
     *         type: integer
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: array
     *             items:
     *              type: object
     *              properties:
     *               client_side_uuid:
     *                type: string
     *               role_client_side_uuid:
     *                type: string
     *               permission_name:
     *                 type: string
     *               _links:
     *                 type: object
     *                 properties:
     *                  self:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  next:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  prev:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT("role-permissions:index"), async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ 
                rows, 
                count, 
                pages,
                "_links": {
                    "self": { "href": `/api/v1/admin/role_permissions?limit=${limit}&page=${page}`, "method": "GET" },
                    "next": { "href": `/api/v1/admin/role_permissions?limit=${limit}&page=${Math.min(parseInt(page) + 1, pages)}`, "method": "GET" },
                    "prev": { "href": `/api/v1/admin/role_permissions?limit=${limit}&page=${Math.max(parseInt(page) - 1, 1)}`, "method": "GET" }
                } 
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/role_permissions':
    *  post:
    *     tags:
    *       - Role Permission Admin Controller
    *     summary: Create a new role permission
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - client_side_uuid
    *          - role_client_side_uuid
    *          - permission_name
    *         properties:
    *          client_side_uuid:
    *           type: string
    *          role_client_side_uuid:
    *           type: string
    *          permission_name:
    *           type: string
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               client_side_uuid:
    *                 type: string
    *               role_client_side_uuid:
    *                 type: string
    *               permission_name:
    *                 type: string
    *               _links:
    *                 type: object
    *                 properties:
    *                  self:
    *                   type: object
    *                   properties:
    *                    href:
    *                     type: string
    *                    method:
    *                     type: string
    *                  get:
    *                   type: object
    *                   properties:
    *                    href:
    *                     type: string
    *                    method:
    *                     type: string
    *                  delete:
    *                   type: object
    *                   properties:
    *                    href:
    *                     type: string
    *                    method:
    *                     type: string
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .post(Middleware.AuthorizePermissionJWT("role-permissions:create"), async (req, res) => {
        try {
            const { client_side_uuid, role_client_side_uuid, permission_name } = req.body
            await commandService.invoke(new CreateCommand(client_side_uuid, { role_client_side_uuid, permission_name }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                "_links": {
                    "self": { "href": `/api/v1/admin/role_permissions`, "method": "POST" },
                    "get": { "href": `/api/v1/admin/role_permission/${client_side_uuid}`, "method": "GET" },
                    "delete": { "href": `/api/v1/admin/role_permission/${client_side_uuid}`, "method": "DELETE" }
                },
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/admin/role_permissions/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/admin/role_permission/{client_side_uuid}':
     *  get:
     *     tags:
     *       - Role Permission Admin Controller
     *     summary: Fetch a role permission by client_side_uuid
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: client_side_uuid
     *        required: true
     *        schema:
     *         type: string
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               client_side_uuid:
     *                 type: string
     *               role_client_side_uuid:
     *                 type: string
     *               permission_name:
     *                 type: string
     *               _links:
     *                 type: object
     *                 properties:
     *                  self:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  delete:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT("role-permissions:show"), async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                "_links": {
                    "self": { "href": `/api/v1/admin/role_permission/${client_side_uuid}`, "method": "GET" },
                    "delete": { "href": `/api/v1/admin/role_permission/${client_side_uuid}`, "method": "DELETE" }
                },
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/role_permission/{client_side_uuid}':
    *  delete:
    *     tags:
    *       - Role Permission Admin Controller
    *     summary: Delete a role permission
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *     responses:
    *      204:
    *        description: No Content
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .delete(Middleware.AuthorizePermissionJWT("role-permissions:delete"), async (req, res) => {
        try {
            const { client_side_uuid } = req.body
            await commandService.invoke(new DeleteCommand(client_side_uuid))
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
