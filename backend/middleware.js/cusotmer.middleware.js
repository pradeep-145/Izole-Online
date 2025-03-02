const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(401);
    cognito.getUser({ AccessToken: token }, (err, data) => {
        if (err) return res.sendStatus(403);
        req.user = data;
        next();
    });
};

module.exports = authenticateJWT;