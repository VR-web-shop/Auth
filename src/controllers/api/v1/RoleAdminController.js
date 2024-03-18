import APIActorError from "../errors/APIActorError.js";
import RoleAdminService from "../../../services/RoleAdminService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import { PERMISSIONS } from "../../../models/Permission.js";
import express from 'express';

const router = express.Router()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/role/:name')
    /**
     * @openapi
     * '/api/v1/admin/role/{name}':
     *  get:
     *     tags:
     *       - Role Admin Controller
     *     summary: Fetch a role by name
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
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.SHOW.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminFindRequest(req.params)
            const response = await RoleAdminService.find(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

    router.route('/api/v1/admin/role/:name/permissions')
    /**
     * @openapi
     * '/api/v1/admin/role/{name}/permissions':
     *  get:
     *     tags:
     *       - Role Admin Controller
     *     summary: Fetch a role's permissions by name
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
     *             type: array
     *             items:
     *              properties:
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
    .get(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.SHOW_PERMISSIONS.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminFindRequest(req.params)
            const response = await RoleAdminService.findPermissions(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

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
     *               name:
     *                type: string
     *               description:
     *                type: string
     *               is_user_defined:
     *                 type: boolean
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.INDEX.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminFindAllRequest(req.query)
            const { roles, pages } = await RoleAdminService.findAll(request)
            res.send({ roles, pages })
        } catch (error) {
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
    .post(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.CREATE.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminCreateRequest(req.body)
            const response = await RoleAdminService.create(request)
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
    * '/api/v1/admin/roles':
    *  put:
    *     tags:
    *       - Role Admin Controller
    *     summary: Update a role
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
    .put(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.UPDATE.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminUpdateRequest(req.body)
            const response = await RoleAdminService.update(request)
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
    * '/api/v1/admin/roles':
    *  delete:
    *     tags:
    *       - Role Admin Controller
    *     summary: Delete a role
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
    .delete(Middleware.AuthorizePermissionJWT(PERMISSIONS.ROLES.DELETE.name), async (req, res) => {
        try {
            const request = new RoleAdminService.RoleRequest.AdminDeleteRequest(req.body)
            await RoleAdminService.destroy(request)
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
