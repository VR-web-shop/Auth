import AuthRequest from './src/dtos/AuthRequest.js'
import AuthResponse from './src/dtos/AuthResponse.js'
import RoleResponse from './src/dtos/RoleResponse.js'
import UserRequest from './src/dtos/UserRequest.js'
import UserResponse from './src/dtos/UserResponse.js'
import MiddlewareJWT from '../products/src/jwt/MiddlewareJWT.js'

export default {
    dtos: {
        AuthRequest,
        AuthResponse,
        RoleResponse,
        UserRequest,
        UserResponse
    },
    middleware: {
        MiddlewareJWT
    }
}
