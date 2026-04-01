import { Admindqms } from "../models/admin.details.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import {errorResponse} from "../utils/errorResponse.js"
import { Queue } from "../models/queue.models.js";

const fetchQueueId = asyncHandler(async function (req, _ , next) {
    const channel = await User.aggregate([
        {
            $match :{
                "adminId"  : req.admin._id
            }
        },
        { $count : "lengthQ" }
    ])
    // [] means no available docs ..not [{"lengthQ" : 0}]
    
    if (!channel.length){
        // none objects ..first time ig 
        const admin  = await Admindqms.findById(req.admin._id)
        if (!admin){
            throw new errorResponse(501, "middlewarre injectId admin fetch failed ")
        }
        
        const queue = await Queue.create({
            adminId : admin._id ,
            institutionName : admin.institutionName , 
            department : admin.department
        })
        if (!queue){
            throw new errorResponse(501, "middlewarre  queue create injectId fetch failed ")
        }
        admin.queueId = queue._id
        req.queueId = queue._id // {1}
        req.queue_length =  channel.length
        admin.save({validateBeforeSave  :false })
    }else {
        /// already created ..need not create 
        const admin  = await Admindqms.findById(req.admin?._id)
        if (!admin){
            throw new errorResponse(501, "middlewarre injectId , admin fetch failed ")
        }
        req.queueId = admin.queueId
        req.queue_length =  channel[0].lengthQ


    }
    next();
}) 

export {fetchQueueId}