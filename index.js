import 'dotenv/config'
import express from 'express'

import Authorize from './src/jwt/Authorize.js'
import Authenticate from './src/jwt/Authenticate.js'

import User, { verifyPassword } from './src/models/User.js'
import { defaultRole } from './src/models/Role.js'

const app = express()

app.get('/api/v1/authorized', Authorize, (req, res) => {
    res.send(req.user)
})

app.post('/api/v1/authenticate', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = User.find({ name: username })
    if (!user) {
        return res.status(401).send({ message: 'User not found' })
    }

    if (!verifyPassword(password, user)) {
        return res.status(401).send({ message: 'Invalid password' })
    }

    const token = Authenticate(user)
    
    res.send({ token })
})

app.post('/api/v1/register', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username) {
        return res.status(400).send({ message: 'Username is required' })
    }

    if (!password) {
        return res.status(400).send({ message: 'Password is required' })
    }

    const role = await defaultRole()
    const user = await User.create({ username, password, role })
    const token = Authenticate(user)
    
    res.send({ token })
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`)
})
