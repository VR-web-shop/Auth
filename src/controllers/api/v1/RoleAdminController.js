import RoleAdminService from "../../../services/RoleAdminService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()

router.use(Middleware.AuthorizeJWT)
router.use(Middleware.AuthorizeAdminJWT)


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
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(async (req, res) => {
        try {
            const response = await RoleAdminService.findAll()
            res.send(response)
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    });

export default router;
