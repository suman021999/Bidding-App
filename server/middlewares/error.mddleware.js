export const errorHandler=(err,req,res,next)=>{
    const statusCode=res.statusCode?res.statusCode:500
    res.status(statusCode).json({
        msg:err.message,
        stack:process.env.NODE_ENV='devploment'?err.stack:null
    })   
}
