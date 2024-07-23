/**
 * @module controllers/api/v1/HealthAdminController
 * @description A module that provides the health check endpoint for the admin API
 * @requires module:express
 * @requires module:jwt/MiddlewareJWT
 * @requires module:queries/Role/ReadCollectionQuery
 * @requires module:services/ModelQueryService
 * @requires module:controllers/api/errors/APIActorError
 * @requires module:rollbar
 */

import APIActorError from "../errors/APIActorError.js";
import ReadCollectionQuery from "../../../queries/Role/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';
import rollbar from "../../../../rollbar.js";

const router = express.Router()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/health')
    /**
     * @openapi
     * '/api/v1/admin/health':
     *  get:
     *     tags:
     *       - Admin Health Controller
     *     summary: Check the health of the application
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
     *              mysql_connected:
     *               type: boolean
     *              broker_connected:
     *               type: boolean
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
            let mysql_connected = false;
            try {
                await queryService.invoke(new ReadCollectionQuery({
                    limit: 10, page: 1
                }))
                mysql_connected = true;
            } catch (error) {
                console.log(error)
                mysql_connected = false;
            }

            res.send({ 
                mysql_connected,
                api_version: 'v1',
                api_type: 'REST',
                exception_handler: 'rollbar',
                server: 'express',
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

export default router;
