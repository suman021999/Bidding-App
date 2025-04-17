import asyncHandler from "express-async-handler"
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"

export const protcet=asyncHandler(async(req,res,next)=>{

    try {
        const token=req.cookies.token
        if(!token){
            res.status(401)
            throw new Error("not authorized to access this page, please login")
        }

        const verified=jwt.verify(token,process.env.JWT_SECRET)

        const user=await User.findById(verified.id).select("-password")

        if(!user){
            res.status(401)
            throw new Error("user not found")
        }

        // req.user=user
        next()
    } catch (error) {
        res.status(401)
            throw new Error("not authorized to access this page, please login")
    }
})