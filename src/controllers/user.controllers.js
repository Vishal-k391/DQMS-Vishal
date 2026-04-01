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

    uniqueid = String(uniqueid).toLowerCase()
    // checking if four digit 
    if (!uniqueid){
        throw new errorResponse(401 , "unique id isnt added")
    }
    if (uniqueid.length !==4){
        throw new errorResponse(401 , "not of the right length uniqueid")
    }


    const emptyCheckPipeline = await User.aggregate([{
        $match:{
            uniqueid : uniqueid ,
            institutionName  :institutionName ,
            department :department
        }
    },{
        $count : "queueLength"
    } ])
    if (!emptyCheckPipeline?.length){
        throw new errorResponse(401, "empty queue none docs matched ..thr user doesnt exist")
    }
    
    else {
        const user = await User.findOne({
            uniqueid : uniqueid ,
            institutionName  :institutionName ,
            department :department
        }).select("-_id -adminId -queueId")
        if (!user){
            throw new errorResponse(501 , "in userGetQueueStatus controller in user.controller while fetching user")
        }

        return res
        .status(200)
        .json(new apiResponse(200 , user , "here's the current user status "))
    }


})

export { userGetQueueStatus }