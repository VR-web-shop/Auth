/**
 * @module controllers/api/v1/UserAuthController
 * @description A module that provides a user authentication controller
 * @requires module:express
 * @requires module:jwt/MiddlewareJWT
 * @requires module:controllers/api/errors/APIActorError
 * @requires module:queries/User/ReadOneQuery
 * @requires module:commands/User/CreateCommand
 * @requires module:commands/User/ProtectedPutCommand
 * @requires module:commands/User/ProtectedDeleteCommand
 * @requires module:services/ModelCommandService
 * @requires module:services/ModelQueryService
 * @requires module:services/AuthService
 * @requires module:services/LinkService
 * @requires module:rollbar
 */

import LinkService from "../../../services/LinkService.js";
import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/User/ReadOneQuery.js";
import CreateCommand from "../../../commands/User/CreateCommand.js";
import ProtectedPutCommand from "../../../commands/User/ProtectedPutCommand.js";
import ProtectedDeleteCommand from "../../../commands/User/ProtectedDeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import AuthService from "../../../services/AuthService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';
import rollbar from "../../../../rollbar.js";

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.route('/api/v1/users')
    /**
    * @openapi
    * '/api/v1/users':
    *  post:
    *     tags:
    *       - User Auth Controller
    *     summary: Create a new user with default role
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - client_side_uuid
    *              - first_name
    *              - last_name
    *              - email
    *              - password
    *            properties:
    *              client_side_uuid:
    *                type: string
    *                default: aaa-bbb-ccc
    *              first_name:
    *                type: string
    *                default: John
    *              last_name:
    *                type: string
    *                default: Doe
    *              email:
    *                type: string
    *                default: test@example.com
    *              password:
    *                type: string
    *                default: 12345678
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               access_token:
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
    .post(async (req, res) => {
        try {
            const { client_side_uuid, email, password, first_name, last_name } = req.body
            const role_client_side_uuid = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
            /**
             * Why not use the PutCommand for creating a new user?
             * Because the PutCommand is idempotent, it will either add or update an user,
             * and we want to ensure that we are only adding a new user, when a user
             * signs up for the first time. The Create command is designed to only create
             * a new user, and will throw an error if the user already exists.
             */
            await commandService.invoke(new CreateCommand(client_side_uuid, { email, password, first_name, last_name, role_client_side_uuid }))
            const { access_token, refresh_token } = await AuthService.create(email, password)
            res.cookie('refresh_token', refresh_token, { httpOnly: true })
            res.send({ 
                access_token,
                ...LinkService.entityLinks(`api/v1/user`, "POST", [
                    { name: 'get', method: 'GET' },
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/user')
    /**
     * @openapi
     * '/api/v1/user':
     *  get:
     *     tags:
     *       - User Auth Controller
     *     summary: Fetch authenticated user
     *     security:
     *      - bearerAuth: []
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
     *                 default: aaa-bbb-ccc
     *               first_name:
     *                 type: string
     *                 default: John
     *               last_name:
     *                 type: string
     *                 default: Doe
     *               email:
     *                 type: string
     *                 default: test@test.com
    *               created_at:
    *                 type: string
    *                 default: 2022-01-01T00:00:00.000Z
    *               updated_at:
    *                 type: string
    *                 default: 2022-01-01T00:00:00.000Z
    *               role_client_side_uuid:
    *                 type: string
    *                 default: aaa-bbb-ccc
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
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT("auth:users:show"), async (req, res) => {
        try {
            const { sub } = req.user
            const response = await queryService.invoke(new ReadOneQuery(sub))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/user`, "GET", [
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/user':
    *  patch:
    *     tags:
    *       - User Auth Controller
    *     summary: Update the authenticated user
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - email
    *              - password
    *              - first_name
    *              - last_name
    *            properties:
    *              first_name:
    *                type: string
    *                default: John
    *              last_name:
    *                type: string
    *                default: Doe
    *              email:
    *                type: string
    *                default: test@example.com
    *              password:
    *                type: string
    *                default: 12345678
    *              verifyPassword:
    *                type: string
    *                default: 12345678
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
    *               first_name:
    *                 type: string
    *               last_name:
    *                 type: string
    *               email:
    *                 type: string
    *               created_at:
    *                 type: string
    *               updated_at:
    *                 type: string
    *               role_client_side_uuid:
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
    .patch(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT("auth:users:put"), async (req, res) => {
        try {
            const { sub } = req.user
            const { email, password, verifyPassword, first_name, last_name } = req.body
            await commandService.invoke(new ProtectedPutCommand(sub, { email, password, verifyPassword, first_name, last_name }))
            const response = await queryService.invoke(new ReadOneQuery(sub))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/user`, "PATCH", [
                    { name: 'get', method: 'GET' },
                    { name: 'delete', method: 'DELETE' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/user':
    *  delete:
    *     tags:
    *       - User Auth Controller
    *     summary: Delete the authenticated user
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *        application/json:
    *           schema:
    *            type: object
    *            required:
    *              - verifyPassword
    *            properties:
    *              verifyPassword:
    *                type: string
    *                default: 12345678
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
    .delete(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT("auth:users:delete"), async (req, res) => {
        try {
            const { verifyPassword } = req.body
            const { sub } = req.user
            await commandService.invoke(new ProtectedDeleteCommand(sub, verifyPassword))
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })



export default router;
