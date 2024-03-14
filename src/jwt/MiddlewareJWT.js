import Jwt from 'jsonwebtoken';

/**
 * @function MiddlewareJWT
 * @description A middleware function to authenticate a JSON Web Token
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const MiddlewareJWT = function(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
}

export default MiddlewareJWT;
