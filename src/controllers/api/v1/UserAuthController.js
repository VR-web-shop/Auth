import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/User/ReadOneQuery.js";
import PutCommand from "../../../commands/User/PutCommand.js";
import DeleteCommand from "../../../commands/User/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

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
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })


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
            const { client_side_uuid, email, password, new_password, first_name, last_name } = req.body
            const request = new UserAuthService.UserRequest.CreateRequest(req.body)
            const { response, refresh_token } = await UserAuthService.create(request)

            res.cookie('refresh_token', refresh_token, { httpOnly: true })
            res.send(response)
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
    * '/api/v1/users':
    *  put:
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
    *              new_password:
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
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .put(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT("auth:users:put"), async (req, res) => {
        try {
            const { sub } = req.user
            const { email, password, new_password, first_name, last_name } = req.body
            await commandService.invoke(new PutCommand({ client_side_uuid: sub, email, password, new_password, first_name, last_name }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send(response)
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
    * '/api/v1/users':
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
    *              - password
    *            properties:
    *              password:
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
            const { password } = req.body
            const { sub } = req.user
            await commandService.invoke(new DeleteCommand(sub, password))
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
