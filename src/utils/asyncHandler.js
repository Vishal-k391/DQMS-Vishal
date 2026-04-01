const asyncHandler  = (fn) =>{
    return async function(req, res , next){
     try {
        await fn(req , res,next) ;
    } catch (error) {
        res.status(error.code || 501).json({
            success : false , 
            message : error.message
        })
    }
}}

export {asyncHandler}