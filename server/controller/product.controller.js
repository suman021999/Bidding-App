import asyncHandler from "express-async-handler"
import {Product} from "../models/product.model.js"
import cloudinary from "../config/cloudinary.js";


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
      if(req.file){
        let uploadedFile; 

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
                folder: "Bidding/Product",
                resource_type: "image", 
            })
        } 
        catch (error) {
            res.status(500);
           
            console.error("Cloudinary upload error:", error);
            throw new Error("Image could not be uploaded");
        }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            public_id: uploadedFile.public_id,
          };
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


export const updateProduct=asyncHandler(async(req,res)=>{
    const { title, description, price, category, height, lengthpic, width, mediumused, weigth } = req.body;
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
      if(req.file){
        let uploadedFile; 

        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
                folder: "Bidding/Product",
                resource_type: "image", 
            })
        } 
        catch (error) {
            res.status(500);
           
            console.error("Cloudinary upload error:", error);
            throw new Error("Image could not be uploaded");
        }

          if (product.image && product.image.public_id) {
      try {
        await cloudinary.uploader.destroy(product.image.public_id);
      } catch (error) {
        console.error("Error deleting previous image from Cloudinary:", error);
      }
    }

        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            public_id: uploadedFile.public_id,
          };
      }
const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      price,
      height,
      lengthpic,
      width,
      mediumused,
      weigth,
      image: Object.keys(fileData).length === 0 ? Product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProduct);


      
 
    
})






