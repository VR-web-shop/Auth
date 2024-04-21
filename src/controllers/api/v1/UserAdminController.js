import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/User/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/User/ReadCollectionQuery.js";
import PutCommand from "../../../commands/User/PutCommand.js";
import DeleteCommand from "../../../commands/User/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/user/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/admin/user/{client_side_uuid}':
     *  get:
     *     tags:
     *       - User Admin Controller
     *     summary: Fetch a user by UUID
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
    .get(Middleware.AuthorizePermissionJWT("users:show"), async (req, res) => {
        try {
            const { client_side_uuid } = req.params
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

router.route('/api/v1/admin/users')
    /**
    * @openapi
    * '/api/v1/admin/users':
    *  get:
    *     tags:
    *       - User Admin Controller
    *     summary: Fetch all users
    *     security:
    *      - bearerAuth: []
    *     parameters:
    *     - in: query
    *       name: page
    *       schema:
    *        type: integer
    *       description: The page number
    *     - in: query
    *       name: limit
    *       schema:
    *        type: integer
    *       description: The number of items per page
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *              pages:
    *               type: integer
    *              users:
    *               type: array
    *               items:
    *                type: object
    *                properties:
    *                 client_side_uuid:
    *                  type: string
    *                 email:
    *                  type: string
    *                 first_name:
    *                  type: string
    *                 last_name:
    *                  type: string
    *                 created_at:
    *                  type: string
    *                 updated_at:
    *                  type: string
    *                 role_client_side_uuid:
    *                  type: string
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
    .get(Middleware.AuthorizePermissionJWT("users:index"), async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ rows, count, pages })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/users':
    *  post:
    *     tags:
    *       - User Admin Controller
    *     summary: Create a new user with custom role
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
    *          - first_name
    *          - last_name
    *          - email
    *          - password
    *          - role_client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          first_name:
    *           type: string
    *           default: John
    *          last_name:
    *           type: string
    *           default: Doe
    *          email:
    *           type: string
    *           default: new_admin@example.com
    *          password:
    *           type: string
    *           default: 12345678
    *          role_client_side_uuid:
    *           type: string
    *           default: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
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
    .post(Middleware.AuthorizePermissionJWT("users:put"), async (req, res) => {
        try {
            const { client_side_uuid, email, password, first_name, last_name, role_client_side_uuid } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { email, password, first_name, last_name, role_client_side_uuid }))
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
    * '/api/v1/admin/users':
    *  put:
    *     tags:
    *       - User Admin Controller
    *     summary: Update a user
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
    *          - first_name
    *          - last_name
    *          - email
    *          - password
    *          - role_client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          first_name:
    *           type: string
    *           default: John
    *          last_name:
    *           type: string
    *           default: Doe
    *          email:
    *           type: string
    *           default: new_admin2@example.com
    *          password:
    *           type: string
    *           default: 12345678
    *          role_client_side_uuid:
    *           type: string
    *           default: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
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
    .put(Middleware.AuthorizePermissionJWT("users:put"), async (req, res) => {
        try {
            const { client_side_uuid, email, password, first_name, last_name, role_client_side_uuid } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { email, password, first_name, last_name, role_client_side_uuid }))
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
    * '/api/v1/admin/users':
    *  delete:
    *     tags:
    *       - User Admin Controller
    *     summary: Delete a user
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
    .delete(Middleware.AuthorizePermissionJWT("users:delete"), async (req, res) => {
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
