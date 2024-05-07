/**
 * @module jwt/AuthenticateJWT
 * @description Provides services for JSON Web Token
 * @requires module:jsonwebtoken
 * @requires module:jwt/errors/AuthenticateJWTArgumentError
 * @requires module:jwt/errors/InvalidRefreshTokenError
 */
import Jwt from 'jsonwebtoken';
import InvalidRefreshTokenError from './errors/InvalidRefreshTokenError.js';
import AuthenticateJWTArgumentError from './errors/AuthenticateJWTArgumentError.js';

const {
    JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
} = process.env;

/**
 * @function NewAuthentication
 * @description Generate a JSON Web Token and a Refresh Token
 * @param {string} userID
 * @param {Array} permissions
 * @returns {Object} { access_token, refresh_token }
 * @throws {AuthenticateJWTArgumentError} if uuid is not a string
 * @throws {AuthenticateJWTArgumentError} if role is not a string
 */
const NewAuthentication = function (uuid, permissions) {
    if (!uuid) throw new AuthenticateJWTArgumentError('uuid is required');
    if (typeof uuid !== 'string') throw new AuthenticateJWTArgumentError('uuid must be a string');

    if (!permissions) throw new AuthenticateJWTArgumentError('permissions is required');
    if (!Array.isArray(permissions)) throw new AuthenticateJWTArgumentError('permissions must be an array');

    const iat = new Date().getTime() / 1000;
    const payload = { iat, sub: uuid, permissions };

    const access_token = Jwt.sign(payload, JWT_ACCESS_SECRET, { 
        expiresIn: JWT_ACCESS_EXPIRES_IN 
    });

    const refresh_token = Jwt.sign(payload, JWT_REFRESH_SECRET, { 
        expiresIn: JWT_REFRESH_EXPIRES_IN 
    });
    
    return { access_token, refresh_token };
}

/**
 * @function RefreshAuthentication
 * @description Refresh a JSON Web Token
 * @param {string} refreshToken
 * @returns {Promise<Object>} access_token
 * @throws {AuthenticateJWTArgumentError} if refreshToken is not a string
 * @throws {AuthenticateJWTArgumentError} if callback is not a function
 * @throws {InvalidRefreshTokenError} if the refresh token is invalid
 */
const RefreshAuthentication = async function (refreshToken) {
    if (!refreshToken) throw new AuthenticateJWTArgumentError('refreshToken is required');
    if (typeof refreshToken !== 'string') throw new AuthenticateJWTArgumentError('refreshToken must be a string');

    return new Promise((resolve, reject) => {
        Jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                reject(new InvalidRefreshTokenError());
            } else {
                const iat = new Date().getTime() / 1000;
                const payload = { iat, sub: decoded.sub, permissions: decoded.permissions };
                const accessToken = Jwt.sign(payload, JWT_ACCESS_SECRET, { 
                    expiresIn: JWT_ACCESS_EXPIRES_IN 
                });

                resolve(accessToken);
            }
        });
    });
}

export default { 
    NewAuthentication, 
    RefreshAuthentication,
    InvalidRefreshTokenError
}
