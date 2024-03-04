import Jwt from 'jsonwebtoken';

const Authenticate = function(user) {
    const iat = new Date().getTime() / 1000;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    const secret = process.env.JWT_SECRET;

    return Jwt.sign({ iat, ...user }, secret, { expiresIn });
}

export default Authenticate;
