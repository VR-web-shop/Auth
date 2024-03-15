import Jwt from 'jsonwebtoken';
import { ROLES } from '../models/Role.js';

/**
 * @function AuthorizeJWT
 * @description A middleware function to authenticate a JSON Web Token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const AuthorizeJWT = function(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    const token = header && header.split(' ')[1];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

/**
 * @function AuthorizeAdminJWT
 * @description A middleware function to authenticate a JSON Web Token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const AuthorizeAdminJWT = function(req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    if (user.role !== ROLES.ADMIN) {
        return res.status(403).send({ message: 'Forbidden' });
    }

    next();
}

export default {
    AuthorizeJWT,
    AuthorizeAdminJWT
}
