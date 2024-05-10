/**
 * @module controllers/api/v1/PermissionAdminController
 * @description A module that provides a controller for managing permissions
 * @requires module:express
 * @requires module:services/ModelCommandService
 * @requires module:services/ModelQueryService
 * @requires module:commands/Permission/PutCommand
 * @requires module:commands/Permission/DeleteCommand
 * @requires module:queries/Permission/ReadOneQuery
 * @requires module:queries/Permission/ReadCollectionQuery
 * @requires module:jwt/MiddlewareJWT
 * @requires module:controllers/api/errors/APIActorError
 */

import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/Permission/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/Permission/ReadCollectionQuery.js";
import PutCommand from "../../../commands/Permission/PutCommand.js";
import DeleteCommand from "../../../commands/Permission/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)



router.route('/api/v1/admin/permissions')
    /**
     * @openapi
     * '/api/v1/admin/permissions':
     *  get:
     *     tags:
     *       - Permission Admin Controller
     *     summary: Fetch all permissions
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
     *               name:
     *                type: string
     *               description:
     *                type: string
     *               defined_by_system:
     *                type: boolean
     *               _links:
     *                type: object
     *                properties:
     *                 self:
     *                  type: object
     *                  properties:
     *                   href:
     *                    type: string
     *                   method:
     *                    type: string
     *                 next:
     *                  type: object
     *                  properties:
     *                   href:
     *                    type: string
     *                   method:
     *                    type: string
     *                 prev:
     *                  type: object
     *                  properties:
     *                   href:
     *                    type: string
     *                   method:
     *                    type: string
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT("permissions:index"), async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ 
                rows, 
                count, 
                pages,
                "_links": {
                    "self": { "href": `/api/v1/admin/permissions`, "method": "GET" },
                    "next": { "href": `/api/v1/admin/permissions?limit=${limit}&page=${Math.max(parseInt(page) + 1, pages)}`, "method": "GET" },
                    "prev": { "href": `/api/v1/admin/permissions?limit=${limit}&page=${Math.min(parseInt(page) - 1, 1)}`, "method": "GET" }
                }
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/permissions':
    *  post:
    *     tags:
    *       - Permission Admin Controller
    *     summary: Create a new permission
    *     security:
    *      - bearerAuth: []
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
    .post(Middleware.AuthorizePermissionJWT("permissions:put"), async (req, res) => {
        try {
            const { name, description } = req.body
            await commandService.invoke(new PutCommand(name, { description }))
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                ...response,
                "_links": {
                    "self": { "href": `/api/v1/admin/permission/${name}`, "method": "POST" },
                    "get": { "href": `/api/v1/admin/permission/${name}`, "method": "GET" },
                    "update": { "href": `/api/v1/admin/permission/${name}`, "method": "PATCH" },
                    "delete": { "href": `/api/v1/admin/permission/${name}`, "method": "DELETE" } 
                }
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/admin/permissions/:name')
    /**
     * @openapi
     * '/api/v1/admin/permission/{name}':
     *  get:
     *     tags:
     *       - Permission Admin Controller
     *     summary: Fetch a permission by name
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: name
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
     * 
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT("permissions:show"), async (req, res) => {
        try {
            const { name } = req.params
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                ...response,
                "_links": {
                    "self": { "href": `/api/v1/admin/permission/${name}`, "method": "GET" },
                    "update": { "href": `/api/v1/admin/permission/${name}`, "method": "PATCH" },
                    "delete": { "href": `/api/v1/admin/permission/${name}`, "method": "DELETE" }
                }
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
    * '/api/v1/admin/permission/{name}':
    *  patch:
    *     tags:
    *       - Permission Admin Controller
    *     summary: Update a permission
    *     security:
    *      - bearerAuth: []
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
    .patch(Middleware.AuthorizePermissionJWT("permissions:put"), async (req, res) => {
        try {
            const { name, description } = req.body
            await commandService.invoke(new PutCommand(name, { description }))
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                ...response,
                "_links": {
                    "self": { "href": `/api/v1/admin/permission/${name}`, "method": "PATCH" },
                    "get": { "href": `/api/v1/admin/permission/${name}`, "method": "GET" },
                    "delete": { "href": `/api/v1/admin/permission/${name}`, "method": "DELETE" },
                }
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
    * '/api/v1/admin/permission/{name}':
    *  delete:
    *     tags:
    *       - Permission Admin Controller
    *     summary: Delete a permission
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - name
    *         properties:
    *          name:
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
    .delete(Middleware.AuthorizePermissionJWT("permissions:delete"), async (req, res) => {
        try {
            const { name } = req.body
            await commandService.invoke(new DeleteCommand(name))
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
