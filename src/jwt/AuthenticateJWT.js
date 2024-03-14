import Jwt from 'jsonwebtoken';

const {
    JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN
} = process.env;

/**
 * @class RefreshTokenError
 * @description An error describing an invalid refresh token.
 * If this error is thrown, the provided refresh token is invalid.
 * @extends Error
 */
class RefreshTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RefreshTokenError';
    }
}

/**
 * @function NewAuthentication
 * @description Generate a JSON Web Token and a Refresh Token
 * @param {number} userID
 * @param {string} role
 * @returns {object} 
 */
const NewAuthentication = function (uuid, role) {
    if (!uuid) throw new Error('uuid is required');
    if (typeof uuid !== 'string') throw new Error('uuid must be a string');

    if (!role) throw new Error('role is required');
    if (typeof role !== 'string') throw new Error('role must be a string');

    const iat = new Date().getTime() / 1000;
    const payload = { iat, sub: uuid, role };

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
 * @returns {object} 
 */
const RefreshAuthentication = async function (refreshToken, callback) {
    if (!refreshToken) throw new Error('refreshToken is required');
    if (typeof refreshToken !== 'string') throw new Error('refreshToken must be a string');

    Jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            throw new RefreshTokenError('Unauthorized');
        } else {
            const iat = new Date().getTime() / 1000;
            const payload = { iat, sub: decoded.sub, role: decoded.role };
            const accessToken = Jwt.sign(payload, JWT_ACCESS_SECRET, { 
                expiresIn: JWT_ACCESS_EXPIRES_IN 
            });

            callback(accessToken);
        }
    });
}

export default { 
    NewAuthentication, 
    RefreshAuthentication,
    RefreshTokenError
}
