import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'

import AuthController from './src/controllers/api/v1/AuthController.js'
import UserController from './src/controllers/api/v1/UserController.js'

const app = express()
const port = process.env.SERVER_PORT

app.use(bodyParser.json())
app.use(AuthController)
app.use(UserController)
app.listen(port, () => console.log(`Server is running on port ${port}`))
