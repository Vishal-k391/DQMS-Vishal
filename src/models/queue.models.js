import mongoose from "mongoose" ;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const queue  = new mongoose.Schema({
    queue_status  :{
        type : Array ,
    } , 
    adminId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Admindqms"
    } ,
    institutionName :{
        type : String , 
        
    } , department :{
        type : String , 
        
    }

},{timestamps :true})
queue.plugin(mongooseAggregatePaginate)


export const Queue =  mongoose.model("Queue" , queue)