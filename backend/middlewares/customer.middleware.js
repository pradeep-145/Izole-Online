const {JwtService} = require('../services/jwt.service.js')

const authenticateJWT=async (req,res,next)=>{
    const token=req.cookies.jwt;
    try {
        if(!token){
            throw new "token Not found"
        }
        const decoded =JwtService.verifyToken(token);
        if(!decoded){
            throw new "Token Expired"
        }
        const user= await customerModel.findByID(decoded.userId);
        if(!user){
            throw new "User Not found";
        }

        req.user=user;
        next();
    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports= authenticateJWT;