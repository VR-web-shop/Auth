import Jwt from 'jsonwebtoken';

const Authorize = function(req, res, next) {
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

export default Authorize;
