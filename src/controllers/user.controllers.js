import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorResponse } from "../utils/errorResponse.js";

import { User } from "../models/users.models.js";

const userGetQueueStatus = asyncHandler(async function (req , res) {
    // get the input from the user 
    // department& institution 
    // check if empty or not 
    // if not empty find the person with his UID , department dropdown , instittuion name 
    
    //input from the user 
    let {uniqueid , institutionName ,department} = req.body ;
    // checking if empty or not 
    if (!(uniqueid && institutionName && department)){
        throw new errorResponse(401, "uniqueid , institutionName ,department isnt added")
    }

    const user_details = [uniqueid , institutionName ,department].map((val)=>{
        return String(val).toLowerCase().trim();
    })   // checking if four digit 
    if (!(uniqueid && uniqueid.length === 4)){
        throw new errorResponse(401 , "unique fetch isssue ..enter proper unique id ")
    }
     

    const emptyCheckPipeline = await User.aggregate([{
        $match:{
            uniqueid : user_details[0] ,
            institutionName  :user_details[1] ,
            department :user_details[2]
        }
    },{
        $count : "queueLength"
    } ])
    if (!emptyCheckPipeline?.length){
        throw new errorResponse(401, "empty queue none docs matched ..thr user doesnt exist")
    }
    
    else {
        let user = await User.findOne({
            uniqueid : user_details[0] ,
            institutionName  :user_details[1] ,
            department :user_details[2]
        }).select("-_id -adminId -queueId ")
        if (!user){
            throw new errorResponse(501 , "in userGetQueueStatus controller in user.controller while fetching user")
        }
        
        return res
        .status(200)
        .json(new apiResponse(200 , user  , "here's the current user status "))
    }


})

export { userGetQueueStatus }