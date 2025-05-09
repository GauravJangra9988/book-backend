import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const protectRoute = async(req,res,next)=>{
    try {
        const token = req.header("Authorization").replace("Bearer ","");
        if(!token) return res.status(401).json({message: "Not authenticated"});
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decode.userId).select("-password");
        if(!user) return res.status(401).json({message: "Invalid Token"});

        req.user = user;
        next();
    
    } catch (error) {
        console.error("Authentication error", error.message);
        res.status(401).json({message: "Token is not valid"});
    }
}


export default protectRoute;