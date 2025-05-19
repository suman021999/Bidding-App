import asyncHandler from "express-async-handler"
import {Bidding} from "../models/bidding.model.js";
import {Product} from "../models/product.model.js"
import {User} from "../models/User.model.js"

export const getBiddingHistory=asyncHandler(async(req,res)=>{
  const { productId} = req.params;
  const biddingHistory=await Bidding.find({product:productId}).sort("-createdAt").populate("user").populate("product")

  res.status(200).json(biddingHistory)
})

export const placeBid=asyncHandler(async(req,res)=>{
  const {productId, price} = req.body;
  const userId=req.user._id
  const product=await Product.findById(productId)
  if(!product.isverify){
    res.status(404)
    throw new Error("bidding is not verified for these product")
  }

  if(!product || product.isSoldout===true){
    res.status(404)
    throw new Error("Invalid product or bidding is closed")
  }

  const existinguserBid=await Bidding.findOne({user:userId, product:productId})

  if(existinguserBid){
    if(price <= existinguserBid.price){
      res.status(400)
      throw new Error("You bid must be higher than your previous bid")
    }
    existinguserBid.price=price
    await existinguserBid.save()
    res.status(200).json({Bidding:existinguserBid})
  }
  else{
    const highestBid=await Bidding.findOne({product:productId}).sort({price:-1})
    if(highestBid && price <= highestBid.price){
      res.status(400)
      throw new Error("You bid must be higher than the current highest bid")
    }
    
  }
  const biddingProduct=await Bidding.create({
    user: userId,
      product: productId,
      price,
  })
  res.status(201).json({Bidding:biddingProduct})
})

export const sellProduct=asyncHandler(async(req,res)=>{
  const {productId} = req.body;
  const userId=req.user.id
  const product=await Product.findById(productId)
  if(!product){
    res.status(404)
    throw new Error("product not found")
  }
  if(product.user.toString() !== userId){
    res.status(403).json({error:"You are not authorized to sell this product"})
    
    
  }
  const highestBid=await Bidding.findOne({product:productId}).sort({price:-1}).populate("user")
     if(highestBid){
      res.status(400)
      throw new Error({error:"no winning bid found for this product"})

    }

    const commissionRate=product.commission
    const commissionAmount=( commissionRate / 100) *highestBid.price
    const finalprice=highestBid.price-commissionAmount

    product.isSoldout=true
    product.soldTo=highestBid.user
    product.soldPrice=finalprice
    

    const admin=await User.findOne({role:"admin"})
    if(admin){
      admin.commissionBalance+=commissionAmount
      await admin.save()
    }
    const seller=await User.findById(product.user)
    if(seller){
      seller.balance+=finalprice
      await seller.save()
    }
    else{
      return res.status(404).json({error:"seller not found"})
    }
    await product.save()
})
