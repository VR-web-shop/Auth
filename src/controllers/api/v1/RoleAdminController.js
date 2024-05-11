/**
 * @module controllers/api/v1/RoleAdminController
 * @description A module that provides a controller for role administration
 * @requires module:express
 * @requires module:jwt/MiddlewareJWT
 * @requires module:queries/Role/ReadOneQuery
 * @requires module:queries/Role/ReadCollectionQuery
 * @requires module:commands/Role/PutCommand
 * @requires module:commands/Role/DeleteCommand
 * @requires module:services/ModelCommandService
 * @requires module:services/ModelQueryService
 * @requires module:controllers/api/errors/APIActorError
 * @requires module:services/LinkService
 * @requires module:rollbar
 */

import LinkService from "../../../services/LinkService.js";
import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/Role/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/Role/ReadCollectionQuery.js";
import PutCommand from "../../../commands/Role/PutCommand.js";
import DeleteCommand from "../../../commands/Role/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';
import rollbar from "../../../../rollbar.js";

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/roles')
    /**
     * @openapi
     * '/api/v1/admin/roles':
     *  get:
     *     tags:
     *       - Role Admin Controller
     *     summary: Fetch all roles
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
     *               name:
     *                type: string
     *               description:
     *                type: string
     *               defined_by_system:
     *                 type: boolean
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
    .get(Middleware.AuthorizePermissionJWT("roles:index"), async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ 
                rows, 
                count, 
                pages,
                ...LinkService.paginateLinks(`api/v1/admin/roles`, parseInt(page), pages),
            })
        } catch (error) {
            rollbar.error(error)

            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/roles':
    *  post:
    *     tags:
    *       - Role Admin Controller
    *     summary: Create a new role
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
    *          - name
    *          - description
    *         properties:
    *          client_side_uuid:
    *           type: string
    *          name:
    *           type: string
    *          description:
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
    *               name:
    *                 type: string
    *               description:
    *                 type: string
    *               defined_by_system:
    *                 type: boolean
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
    *                  update:
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
    .post(Middleware.AuthorizePermissionJWT("roles:put"), async (req, res) => {
        try {
            const { client_side_uuid, name, description } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { name, description }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/admin/roles`, "POST", [
                    { name: 'get', method: 'GET' },
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE', unless: response.defined_by_system === 1 }
                ])
            }, `api/v1/admin/role/${client_side_uuid}`)
        } catch (error) {
            rollbar.error(error)

            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/admin/role/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/admin/role/{client_side_uuid}':
     *  get:
     *     tags:
     *       - Role Admin Controller
     *     summary: Fetch a role by client_side_uuid
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
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               defined_by_system:
     *                 type: boolean
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
     *                  update:
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
    .get(Middleware.AuthorizePermissionJWT("roles:show"), async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/admin/role/${client_side_uuid}`, "GET", [
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE', unless: response.defined_by_system === 1 }
                ])
            })
        } catch (error) {
            rollbar.error(error)

            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/role/{client_side_uuid}':
    *  patch:
    *     tags:
    *       - Role Admin Controller
    *     summary: Update a role
    *     security:
    *      - bearerAuth: []
    *     parameters:
    *     - in: path
    *       name: client_side_uuid
    *       required: true
    *       schema:
    *        type: string
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - name
    *          - description
    *         properties:
    *          name:
    *           type: string
    *          description:
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
    *               name:
    *                 type: string
    *               description:
    *                 type: string
    *               defined_by_system:
    *                 type: boolean
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
    .patch(Middleware.AuthorizePermissionJWT("roles:put"), async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            const { name, description } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { name, description }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/admin/role/${client_side_uuid}`, "PATCH", [
                    { name: 'get', method: 'GET' },
                    { name: 'delete', method: 'DELETE', unless: response.defined_by_system === 1 }
                ])
            })
        } catch (error) {
            rollbar.error(error)

            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/role/{client_side_uuid}':
    *  delete:
    *     tags:
    *       - Role Admin Controller
    *     summary: Delete a role
    *     security:
    *      - bearerAuth: []
    *     parameters:
    *     - in: path
    *       name: client_side_uuid
    *       required: true
    *       schema:
    *        type: string
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
    .delete(Middleware.AuthorizePermissionJWT("roles:delete"), async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            await commandService.invoke(new DeleteCommand(client_side_uuid))
            res.sendStatus(204)
        } catch (error) {
            rollbar.error(error)

            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
