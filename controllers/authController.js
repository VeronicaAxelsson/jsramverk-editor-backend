const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.checkToken = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    message: 'Token is not valid.'
                }
            });
        }
    });
    next();
};
