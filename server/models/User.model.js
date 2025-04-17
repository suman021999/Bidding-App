import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
          },
          email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
          },
          password: {
            type: String,
          },
          photo: {
            type: String,
            require: [true, "Please add a photo"],
            default:"xngjkfg"
          },
          role:{
            type:String,
            enum:["admin","seller","buyer"],
            default:"buyer"
          },
          commissionBalance:{
            type:Number,
            default:0
          },
          balance:{
            type:Number,
            default:0
          }
    },

    { timestamps: true })


    userSchema.pre("save", async function(next){

      if(!this.isModified("password")){
        return next()
      }
      const salt=await bcrypt.genSalt(10)
      const hasPassword= await bcrypt.hash(this.password,salt)
      this.password=hasPassword
      next()

    })




  export const User = mongoose.model("User", userSchema);