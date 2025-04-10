import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config(
    {
        path:'./env'
    }
)

const database=async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}`)
       console.log("Mongodb connected")
    } catch (err) {
        console.log("Error",err)
        process.exit(1)
    }
}



export default database