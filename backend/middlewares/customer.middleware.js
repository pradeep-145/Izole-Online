const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
const cognito = new CognitoIdentityProviderClient({ region: 'your-region' });

const authenticateJWT = (req, res, next) => {
    
    const token = req.cookies.jwt;
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
