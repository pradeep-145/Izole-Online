const jwt = require('jsonwebtoken')
exports.JwtService={
    generateToken:async(payload)=>{
        const token=await jwt.sign(payload, process.env.SECRET_KEY
            ,{
                expiresIn:'150d',
                algorithm:"RS256",
            }
        );
        return token;
    },

    verifyToken:async(token)=>{
        const decoded = await jwt.verify(token, process.env.SECRET_KEY,{
            algorithms:['RS256']
        });
        return decoded;
    }
}