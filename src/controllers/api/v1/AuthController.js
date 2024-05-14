/**
 * @module controllers/api/v1/AuthController
 * @description Auth Controller
 * @requires module:express
 * @requires module:services/AuthService
 * @requires module:controllers/api/errors/APIActorError
 * @requires module:services/LinkService
 * @requires module:rollbar
 */

import LinkService from "../../../services/LinkService.js";
import APIActorError from "../errors/APIActorError.js";
import AuthService from "../../../services/AuthService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()

router.route('/api/v1/auth')
    /**
     * @openapi
     * '/api/v1/auth':
     *  post:
     *     tags:
     *       - Auth Controller
     *     summary: Authenticate a user
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
     *                default: userAdmin@example.com
     *              password:
     *                type: string
     *                default: 126345678
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
     *                  refresh:
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
            const { email, password } = req.body
            const { access_token, refresh_token } = await AuthService.create(email, password)
            
            res.cookie('refresh_token', refresh_token, { httpOnly: true })
            res.send({
                access_token,
                ...LinkService.entityLinks(`api/v1/auth`, "POST", [
                    { name: 'refresh', method: 'PUT' },
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
     * '/api/v1/auth':
     *  put:
     *     tags:
     *       - Auth Controller
     *     summary: Reauthenticate a user
     *     parameters:
     *       - in: cookie
     *         name: refresh_token
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
            const { refresh_token } = req.cookies
            const response = await AuthService.refresh(refresh_token)
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/auth`, "PUT", [
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

export default router;
