import { defaultRole } from "../../../models/Role.js";
import User from "../../../models/User.js";
import AuthJWT from "../../../jwt/AuthenticateJWT.js";
import express from 'express';

const router = express.Router()

/**
 * @description Create a new user
 * @param {string} email
 * @param {string} password
 * @returns {Response}
 */
router.post('/api/v1/users', async (req, res) => {
    const { email, password } = req.body

    if (!email) {
        return res.status(400).send({ message: 'E-mail is required' })
    }

    if (!password) {
        return res.status(400).send({ message: 'Password is required' })
    }

    const exist = await User.findOne({ where: { email } })
    if (exist) {
        return res.status(409).send({ message: 'User already exists' })
    }

    const role = await defaultRole()
    const userOptions = { email, password, title: role.title }
    const user = await User.create(userOptions)
    const { access_token, refresh_token } = AuthJWT.NewAuthentication(user.uuid, role.title)
    
    res.cookie('refresh_token', refresh_token, { httpOnly: true })
    res.send({ access_token })
})

export default router;
