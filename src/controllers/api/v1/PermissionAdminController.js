import APIActorError from "../errors/APIActorError.js";
import PermissionAdminService from "../../../services/PermissionAdminService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import { PERMISSIONS } from "../../../models/Permission.js";
import express from 'express';

const router = express.Router()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/permission/:name')
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
     *               is_user_defined:
     *                 type: boolean
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT(PERMISSIONS.PERMISSIONS.SHOW.name), async (req, res) => {
        try {
            const request = new PermissionAdminService.PermissionRequest.FindRequest(req.params)
            const response = await PermissionAdminService.find(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

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
     *               is_user_defined:
     *                type: boolean
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT(PERMISSIONS.PERMISSIONS.INDEX.name), async (req, res) => {
        try {
            const request = new PermissionAdminService.PermissionRequest.FindAllRequest(req.query)
            const { permissions, pages } = await PermissionAdminService.findAll(request)
            res.send({ permissions, pages })
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
    *               is_user_defined:
    *                 type: boolean
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .post(Middleware.AuthorizePermissionJWT(PERMISSIONS.PERMISSIONS.CREATE.name), async (req, res) => {
        try {
            const request = new PermissionAdminService.PermissionRequest.CreateRequest(req.body)
            const response = await PermissionAdminService.create(request)
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
    * '/api/v1/admin/permissions':
    *  put:
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
    *               is_user_defined:
    *                 type: boolean
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .put(Middleware.AuthorizePermissionJWT(PERMISSIONS.PERMISSIONS.UPDATE.name), async (req, res) => {
        try {
            const request = new PermissionAdminService.PermissionRequest.UpdateRequest(req.body)
            const response = await PermissionAdminService.update(request)
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
    * '/api/v1/admin/permissions':
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
    .delete(Middleware.AuthorizePermissionJWT(PERMISSIONS.PERMISSIONS.DELETE.name), async (req, res) => {
        try {
            const request = new PermissionAdminService.PermissionRequest.DeleteRequest(req.body)
            await PermissionAdminService.destroy(request)
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
