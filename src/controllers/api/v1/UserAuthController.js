import APIActorError from "../errors/APIActorError.js";
import UserAuthService from "../../../services/UserAuthService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import { PERMISSIONS } from "../../../models/Permission.js";
import express from 'express';

const router = express.Router()


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
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT(PERMISSIONS.AUTH.SHOW.name), async (req, res) => {
        try {
            const response = await UserAuthService.find(req.user.sub)
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
    *              - email
    *              - password
    *            properties:
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
    *              - password
    *            properties:
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
    .put(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT(PERMISSIONS.AUTH.UPDATE.name), async (req, res) => {
        try {
            const request = new UserAuthService.UserRequest.UpdateRequest(req.body)
            const reponse = await UserAuthService.update(request, req.user.sub)
            res.send(reponse)
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
    .delete(Middleware.AuthorizeJWT, Middleware.AuthorizePermissionJWT(PERMISSIONS.AUTH.DELETE.name), async (req, res) => {
        try {
            const request = new UserAuthService.UserRequest.DeleteRequest(req.body)
            await UserAuthService.destroy(request, req.user.sub)
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
