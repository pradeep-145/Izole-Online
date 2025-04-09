const {JwtService} = require('../services/jwt.service.js')
const customerModel = require('../models/customer.model.js');
const authenticateJWT=async (req,res,next)=>{
    const token=req.cookies.jwt;
    try {
        if(!token){
            throw new "token Not found"
        }
        const decoded = await JwtService.verifyToken(token);
        if(!decoded){
            throw new "Token Expired"
        }
        const user= await customerModel.find({_id:decoded.userId});
        if(!user){
            console.log(token)
            throw new "User Not found";
        }

        req.user=decoded;
        next();
    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports= authenticateJWT;