const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        console.error('Authorization header missing');
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error('Token missing in Authorization header');
        return res.sendStatus(401);
    }

    cognito.getUser({ AccessToken: token }, (err, data) => {
        if (err) {
            console.error('Error validating token:', err);
            return res.sendStatus(403);
        }
        req.user = data;
        next();
    });
};

module.exports = { authenticateJWT };
