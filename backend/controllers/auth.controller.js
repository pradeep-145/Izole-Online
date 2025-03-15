
const crypto = require("crypto");
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

const cognito = new CognitoIdentityProviderClient({ region: 'ap-south-1' });

const generateSecretHash = (username) => {
  return crypto
    .createHmac("sha256", process.env.APP_CLIENT_SECRET)
    .update(username + process.env.APP_CLIENT_ID)
    .digest("base64");
};
const AuthController = {
  signUp: async (req, res) => {
    const { username, password, email, phoneNumber } = req.body;
    console.log("Sign-up request received:", { username, email, phoneNumber });
    try {
      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+91${phoneNumber}`;
      console.log("Formatted phone number:", formattedPhoneNumber);
      const params = {
        ClientId: process.env.APP_CLIENT_ID,
        SecretHash: generateSecretHash(username),
        Username: username,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "phone_number", Value: formattedPhoneNumber },
          { Name: "preferred_username", Value: username },
        ],
      };
      const data = await cognito.signUp(params).promise();
      console.log("Sign-up successful:", data);
      res.json(data);
    } catch (err) {
      console.error("Sign-up error:", err);
      res.status(500).json(err);
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;
    console.log("Login request received:", { username });
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.APP_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(username),
      },
    };
    try {
      const data = await cognito.initiateAuth(params).promise();
      const token = data.AuthenticationResult.AccessToken;
      res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json(err);
    }
  },

  confirmUser: async (req, res) => {
    const { username, code } = req.body;
    console.log("Confirm request received:", { username, code });
    try {
      const params = {
        ClientId: process.env.APP_CLIENT_ID,
        SecretHash: generateSecretHash(username),
        ConfirmationCode: code,
        Username: username,
      };
      const data = await cognito.confirmSignUp(params).promise();
      console.log("Confirm successful:", data);
      res.json(data);
    } catch (err) {
      console.error("Confirm error:", err);
      if (err.code === "CodeMismatchException") {
        res.status(400).json({
          message: "Invalid verification code provided, please try again.",
        });
      } else {
        res.status(500).json(err);
      }
    }
  },
};

module.exports=AuthController
