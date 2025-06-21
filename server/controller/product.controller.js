import asyncHandler from "express-async-handler"
import {Product} from "../models/product.model.js"
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

import slugify from "slugify"



export const createProduct=asyncHandler(async(req,res)=>{
    const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
    const userId = req.user.id;

    const originalSlug=slugify(title,{
        lower:true,
        remove: /[*+~.()'"!:@]/g,
        strict: true,
    })

    let slug = originalSlug;
    let suffix = 1;

    while (await Product.findOne({slug})){
        slug=`${originalSlug}-${suffix}`
        suffix++;
    }

    if (!title || !description || !price) {
        res.status(400);
        throw new Error("Please fill in all fields");
      }


let fileData = {};

if (req.file) {
  try {
    // Convert buffer to stream and upload to Cloudinary
    const uploadedFile = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Bidding/Product",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      
      // Create readable stream from buffer and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(stream);
    });

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      public_id: uploadedFile.public_id,
    };
    
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500);
    throw new Error("Image could not be uploaded");
  }
}



      
      const product=await Product.create({
        user:userId,
        title,
        slug:slug,
        description,
        price,
        category,
        height,
        lengthpic,
        width,
        mediumused,
        weigth,
        image: fileData, 
    })
    res.status(201).json({
        success: true,
        data: product,
      });

    res.send("jndvnsd send")
})


export const getAllProducts=asyncHandler(async(req,res)=>{
  const products=await Product.find({}).sort("-createdAt").sort("-createdAt").populate("user")

  
  res.json({products})
})

export const deleteProduct=asyncHandler(async(req,res)=>{
const {id}=req.params
const product=await Product.findById(id)

if(!product){
    res.status(404)
    throw new Error("Product not found")
}
 if (product.user?.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

if(product.image && product.image.public_id){
    try {
        await cloudinary.uploader.destroy(product.image.public_id);
      }
      catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }

}

 await Product.findByIdAndDelete(id);
res.status(200).json({message:"Product deleted successfully"})


})


export const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, height, lengthpic, width, mediumused, weight } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  let fileData = {};
  if (req.file) {
    try {
      // Upload new image using stream (for memory storage)
      const uploadedFile = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Bidding/Product",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        // Convert buffer to stream
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
      });

      // Delete old image if it exists
      if (product.image?.public_id) {
        try {
          await cloudinary.uploader.destroy(product.image.public_id);
        } catch (error) {
          console.error("Error deleting previous image:", error);
        }
      }

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        public_id: uploadedFile.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      category,
      price,
      height,
      lengthpic,
      width,
      mediumused,
      weight, // Fixed typo from 'weigth' to 'weight'
      image: Object.keys(fileData).length === 0 ? product.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  
  res.status(200).json(updatedProduct);
});


export const getAllProductsofUser=asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const products = await Product.find({ user: userId }).sort("-createAt").populate("user");
 
  
    res.status(200).json(products);
  })

export const verifyAndAddCommissionProductByAmdin=asyncHandler(async(req,res)=>{
     const { commission } = req.body;
  const { id } = req.params;
    const product=await Product.findById(id)
    if(!product){
        res.status(404)
        throw new Error("Product not found")
    }
    product.isverify=true
    product.commission=commission
    await product.save()
    res.status(200).json({message:"Product verified successfully",data:product})

})

export const getAllProductsByAmdin=asyncHandler(async(req,res)=>{
  const products=await Product.find({}).sort("-createdAt").populate("user")
  res.status(200).json(products)
})

export const deleteProductsByAmdin=asyncHandler(async(req,res)=>{
  try {
    const { productIds} = req.body;

    const result = await Product.findOneAndDelete({ _id: productIds });

    res.status(200).json({ message: `${result.deletedCount} products deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export const getProductBySlug=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const product=await Product.findById(id).populate("user")
  if(!product){
    res.status(404)
    throw new Error("Product not found")
  }
  res.status(200).json(product)
})
export const getAllSoldProducts=asyncHandler(async(req,res)=>{
    const products = await Product.find({ isSoldout: true }).sort("-createAt").populate("user");
    res.status(200).json(products);
})


