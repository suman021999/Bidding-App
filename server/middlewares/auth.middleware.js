import expressAsyncHandler from "express-async-handler"
import {User} from "../models/User.model.js"
import jwt from "jsonwebtoken"

export const protect = expressAsyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, Please Login");
      }
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, Please Login");
    }
  });