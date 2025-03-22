const jwt = require('jsonwebtoken')
const fs= require('fs')
const path=require('path')
exports.JwtService={
    generateToken:async(payload)=>{
        const privateKey = fs.readFileSync(path.join(__dirname, process.env.PRIVATE_KEY), "utf8");

        const token=await jwt.sign(payload, privateKey
            ,{
                expiresIn:'150d',
                algorithm:"RS256",
            }
        );
        return token;
    },

    verifyToken:async(token)=>{
        const publicKey = fs.readFileSync(path.join(__dirname, process.env.PUBLIC_KEY), "utf8");

        const decoded = await jwt.verify(token, publicKey ,{
            algorithms:['RS256']
        });
        return decoded;
    }
}