import mongoose, { Schema } from "mongoose";


const productSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
          },
          title: {
            type: String,
            require: [true, "Please add a title"],
            trim: true,
          },
          // slug: {
          //   type: String,
          //   unique: true,
          // },
          description: {
            type: String,
            require: [true, "Please add a description"],
            trim: true,
          },
          image:{
            type:Object,
            default:{},
          },
          category: {
            type: String,
            require: [true, "Please add a category"],
            default:"ALL",
          },
          commission:{
            type:Number,
            default:0,
          },
          price: {
            type:Number,
            require: [true, "Please add a price"],
            
          },
          height:{type:Number},

          lengthpic:{type:Number},

          width: {type: Number},

          mediumused: {type: String},

          weigth: {type: Number},

          isSoldout: {
            type: Boolean,
            default: false,
          },
          soldTo: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User" 
        },
        
    },

    { timestamps: true })

    export const Product = mongoose.model("Product", productSchema);