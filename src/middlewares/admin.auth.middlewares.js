// access accessToken by req.cookie
// check by .verify why ?? what if a token is changed
// vreate an object in req object storing the details of user ..useful while loogin out as we need to access user instance ..not possible to ask from user while logging out 
// when looginf out ..it willl get the access to user data ..us e it as midware for for logout copntroller so that info injected bfeore logout 
import jwt from "jsonwebtoken"
import { Admindqms } from "../models/admin.details.models.js";
import { errorResponse } from "../utils/errorResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"

const checklogin = asyncHandler(async function (req ,_,next) {
    // req, res for creating obj in req 
    const cookieToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "") ;
    if (!cookieToken){
        console.log(cookieToken)
        throw new errorResponse(401, "token not found, not loged in ")
    }
    // verify of token by jwt.verify
    
    const decodedPayload =  jwt.verify(cookieToken , process.env.ADMIN_SECRET_A) ;  
    if (!decodedPayload){
        throw new errorResponse(error.code || 401 , "ivalid token ..most probabaly modified..login again pls  ")
    }

    const admin = await Admindqms.findById(decodedPayload._id)
    if (!admin){
        throw new errorResponse(501 , "db error in fetching info in verify middleware")
    }
    req.admin = admin ;
    next();
})

export {checklogin}