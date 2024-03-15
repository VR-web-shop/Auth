import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import AuthController from './src/controllers/api/v1/AuthController.js'
import UserController from './src/controllers/api/v1/UserController.js'
import UserAdminController from './src/controllers/api/v1/UserAdminController.js'
import RoleAdminController from './src/controllers/api/v1/RoleAdminController.js'
import SwaggerController from './src/controllers/SwaggerController.js'

const app = express()
const port = process.env.SERVER_PORT

app.use(bodyParser.json())
app.use(cookieParser())

app.use(AuthController)
app.use(UserController)
app.use(SwaggerController)
app.use(UserAdminController)
app.use(RoleAdminController)

app.listen(port, () => console.log(`Server is running on port ${port}`))
