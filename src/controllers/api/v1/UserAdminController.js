import APIActorError from "../errors/APIActorError.js";
import UserAdminService from "../../../services/UserAdminService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()

router.use(Middleware.AuthorizeJWT)
router.use(Middleware.AuthorizeAdminJWT)

router.route('/api/v1/admin/user/:uuid')
    /**
     * @openapi
     * '/api/v1/admin/user/{uuid}':
     *  get:
     *     tags:
     *       - User Admin Controller
     *     summary: Fetch a user by UUID
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: uuid
     *        required: true
     *        schema:
     *         type: string
     *         format: uuid
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               uuid:
     *                 type: string
     *               email:
     *                 type: string
     *               created_at:
     *                 type: string
     *               updated_at:
     *                 type: string
     *               role_name:
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
    .get(async (req, res) => {
        try {
            const request = new UserAdminService.UserRequest.AdminFindRequest(req.params)
            const response = await UserAdminService.find(request)
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
    *               uuid:
    *                 type: string
    *               email:
    *                 type: string
    *               created_at:
    *                 type: string
    *               updated_at:
    *                 type: string
    *               role_name:
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
    .get(async (req, res) => {
        try {
            const response = await UserAdminService.findAll()
            res.send(response)
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
    *          - email
    *          - password
    *          - role_name
    *         properties:
    *          email:
    *           type: string
    *           default: new_admin@example.com
    *          password:
    *           type: string
    *           default: 12345678
    *          role_name:
    *           type: string
    *           default: admin
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               uuid:
    *                 type: string
    *               email:
    *                 type: string
    *               created_at:
    *                 type: string
    *               updated_at:
    *                 type: string
    *               role_name:
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
            const request = new UserAdminService.UserRequest.AdminCreateRequest(req.body)
            const response = await UserAdminService.create(request)
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
    *          - uuid
    *          - email
    *          - password
    *          - role_name
    *         properties:
    *          uuid:
    *           type: string
    *           format: uuid
    *          email:
    *           type: string
    *           default: new_admin2@example.com
    *          password:
    *           type: string
    *           default: 12345678
    *          role_name:
    *           type: string
    *           default: member
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               uuid:
    *                 type: string
    *               email:
    *                 type: string
    *               created_at:
    *                 type: string
    *               updated_at:
    *                 type: string
    *               role_name:
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
    .put(async (req, res) => {
        try {
            const request = new UserAdminService.UserRequest.AdminUpdateRequest(req.body)
            const response = await UserAdminService.update(request)
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
    *          - uuid
    *         properties:
    *          uuid:
    *           type: string
    *           format: uuid
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
    .delete(async (req, res) => {
        try {
            const request = new UserAdminService.UserRequest.AdminDeleteRequest(req.body)
            await UserAdminService.destroy(request)
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
