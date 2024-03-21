import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import AuthController from './src/controllers/api/v1/AuthController.js'
import UserAuthController from './src/controllers/api/v1/UserAuthController.js'
import UserAdminController from './src/controllers/api/v1/UserAdminController.js'
import RoleAdminController from './src/controllers/api/v1/RoleAdminController.js'
import PermissionAdminController from './src/controllers/api/v1/PermissionAdminController.js'
import SwaggerController from './src/controllers/SwaggerController.js'

const app = express()
const port = process.env.SERVER_PORT

app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true // Allow credentials (including cookies)
}));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(SwaggerController)
app.use(AuthController)
app.use(UserAuthController)
app.use(UserAdminController)
app.use(RoleAdminController)
app.use(PermissionAdminController)

app.listen(port, () => console.log(`Server is running on port ${port}`));
