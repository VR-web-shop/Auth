import User, { verifyPassword } from "../../../models/User.js";
import Role from "../../../models/Role.js";
import AuthJWT from "../../../jwt/AuthenticateJWT.js";
import express from 'express';

const router = express.Router()

/**
 * @description Generate a new access token and a refresh token
 * @param {string} email
 * @param {string} password
 * @returns {Response}
 */
router.post('/api/v1/authenticate', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).send({ message: 'E-mail is required' })
    }

    if (!password) {
        return res.status(400).send({ message: 'Password is required' })
    }

    const user = await User.findOne({ where: { email }, include: Role })
    if (!user) {
        return res.status(401).send({ message: 'User not found' })
    }

    if (!await verifyPassword(password, user)) {
        return res.status(401).send({ message: 'Invalid password' })
    }

    const { access_token, refresh_token } = AuthJWT.NewAuthentication(user.uuid, user.title)

    res.cookie('refresh_token', refresh_token, { httpOnly: true })
    res.send({ access_token, refresh_token })
})

/**
 * @description Refresh the access token
 * @param {string} refresh_token
 * @returns {Response}
 */
router.post('/api/v1/refresh_authentication', (req, res) => {
    if (!req.cookies.refresh_token) {
        return res.status(401).send({ message: 'Unauthorized' })
    }

    try {
        const { refresh_token } = req.cookies
        AuthJWT.RefreshAuthentication(refresh_token, (access_token) => {
            res.send({ access_token })
        })
    } catch (error) {
        if (error instanceof AuthJWT.RefreshTokenError) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        console.error(error)

        return res.status(500).send({ message: 'Internal Server Error' })
    }    
})

export default router;
