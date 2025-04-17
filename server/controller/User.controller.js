import asyncHandler from "express-async-handler"
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

const generaltrToken=(id)=>{
   // return jwt.sing({id}, process.env.JWT_SECRET,{expiresIn:"200d"})

   return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:"1d"})

}

export const registerUser=asyncHandler(async(req,res)=>{
   const{username,email,password}=req.body
   if(!username || !email || !password ){
    res.status(400)
    throw new Error ("plese fill in all required files")
   }


   const userExits = await User.findOne({email})
   if(userExits){
      res.status(400)
      throw new Error('Email is already in use or exist')
   }
   const user=await User.create({
      username,
      email,
      password
   })
   const token=generaltrToken(user._id)
   res.cookie("token",token,{
      path:"/",
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"none",
      secure:true
   })

   if(user){
      const {_id,username,email,photo,role}=user
      res.status(201).json({_id,username,email,photo,role})
   }

   else{
      res.status(400)
      throw new Error("Invalid user data")
   }

})


export const loginUser=asyncHandler(async(req,res)=>{
   const {email,password}=req.body
   if(!email || !password){
      res.status(400)
      throw new Error("Please add email and password")
   }

   const user=await User.findOne({email})

   if(!user){
      res.status(400)
      throw new Error("user not found,please singUp")
   }


   const passwordIsCorrect=await bcrypt.compare(password,user.password)

   const token=generaltrToken(user._id)

   res.cookie("token",token,{
      path:"/",
      httpOnly:true,
      expires:new Date(Date.now()+1000*86400),
      sameSite:"none",
      secure:true
   })

   if(user && passwordIsCorrect){
      const {_id,username,email,photo,role}=user
      res.status(201).json({_id,username,email,photo,role})
   }
   else{
      res.status(400)
      throw new Error("Invalid user data")
   }
})


export const loginStatus=asyncHandler(async(req,res)=>{
   const token=req.cookies.token
   if(!token){
      return res.json(false)
   }

   const verified=jwt.verify(token,process.env.JWT_SECRET)
   if(verified){
      return res.json(true)
   }
   return res.json(false)
})


export const logout=asyncHandler(async(req,res)=>{
   res.cookie("token",'',{
      path:"/",
      httpOnly:true,
      expires:new Date(0),
      sameSite:"none",
      secure:true
   })
   return res.status(200).json({msg:"successful logout"})
})

export const loginASseller = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add Email and Password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found, Please signUp");
  }

  const passwordIsCorrrect = await bcrypt.compare(password, user.password);

  const token = generaltrToken(user._id);

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  user.role = "seller";
  user.save();
  if (user && passwordIsCorrrect) {
    const { _id, username, email, photo, role } = user;
    res.status(201).json({ _id, username, email, photo, role, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
}); 

export const getUser=asyncHandler(async(req,res)=>{
const user=await User.findById(req.user._id).select("-password")
res.status(200).json(user)
})

export const getuserBalence=asyncHandler(async(req,res)=>{
   const user=await User.findById(req.user._id)

   if(!user){
      res.status(404)
      throw new Error("user not found")
   }

   res.status(200).json({balance:user.balance})
})

export const getAlluser=asyncHandler(async(req,res)=>{
   const userList=await User.find({})

   if(!userList.length){
      return res.status(404).json({msg:"no user found"})
   }
   res.status(200).json(userList)
})

export const isAdmin=asyncHandler(async(req,res,next)=>{
   if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403);
      throw new Error("Access denied. You are not an admin.");
    }
})

export const estimateIncome = asyncHandler(async (req, res) => {
   try {
     const admin = await User.findOne({ role: "admin" });
     if (!admin) {
       return res.status(404).json({ error: "Admin user not found" });
     }
     const commissionBalance = admin.commissionBalance;
     res.status(200).json({ commissionBalance});
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal server error" });
   }
 });


