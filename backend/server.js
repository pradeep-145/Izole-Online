const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const AWS = require('aws-sdk');
require('dotenv').config()
const app = express();
app.use(express.json());

let client;

// Initialize OpenID Client for Cognito Authentication
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_LfOyhjQgS');
    client = new issuer.Client({
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        redirect_uris: ['https://d84l1y8p4kdic.cloudfront.net/callback'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);

// Configure session middleware
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    req.isAuthenticated = !!req.session.userInfo;
    next();
};

// Protected Home Route
app.get('/', checkAuth, (req, res) => {
    res.json({
        message: "Welcome to Home",
        isAuthenticated: req.isAuthenticated,
        user: req.session.userInfo || null
    });
});

// Signup Route (Registers a User in Cognito)
app.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    
    const cognito = new AWS.CognitoIdentityServiceProvider({
        region: 'ap-south-1'
    });

    const params = {
        ClientId: process.env.APP_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email },
            { Name: "name", Value: name }
        ]
    };

    try {
        await cognito.signUp(params).promise();
        res.json({ message: "User signed up successfully! Please confirm your email." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login Route (Redirects to Cognito Login)
app.get('/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = client.authorizationUrl({
        scope: 'email openid phone',
        state,
        nonce
    });

    res.redirect(authUrl);
});

// Callback Route (Handles Cognito Authentication Response)
app.get('/callback', async (req, res) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            'https://d84l1y8p4kdic.cloudfront.net/callback',
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state
            }
        );

        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        res.redirect('/');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://ap-south-1lfoyhjqgs.auth.ap-south-1.amazoncognito.com/logout?client_id=12viv8c66r463np0b06lfn3cmb&logout_uri=https://d84l1y8p4kdic.cloudfront.net`;
    res.redirect(logoutUrl);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
