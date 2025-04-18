import asyncHandler from "express-async-handler"
import {Product} from "../models/product.model.js"
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
        // image
    
       
    })
    res.status(201).json({
        success: true,
        data: product,
      });
})


