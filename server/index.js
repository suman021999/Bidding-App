import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
import userRouter from './routes/User.route.js'
import productRouter from './routes/product.route.js'
import biddingRouter from './routes/bidding.route.js'
import database from './database/database.js'
import {errorHandler} from "./middlewares/error.mddleware.js"

const app=express()
dotenv.config()
database()


app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

app.use(express())
app.use(cookieParser())

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/bidding",biddingRouter)

app.use(errorHandler)

// Setup __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/",(req,res)=>{
    res.send("home page")
})

const port =process.env.PORT || 3000

app.listen(port,()=>console.log(`server run on ${port}`))


// {   
//   "email":"patra6319@gmail.com",
//   "username":"patra6319",
//   "password":"Suman@1999"
//   }