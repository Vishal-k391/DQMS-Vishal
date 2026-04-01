import mongoose from "mongoose" 

const user = new mongoose.Schema({
    fullname_user :{
        type : String 
    } , 
    phone : {
        type : Number ,  
    } ,
    uniqueid :{
        type : String , 
        required : true 
    }, 
    tokenNo :{
        type : Number ,
    } ,queueId :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Queue"
    }
    , refreshToken :{
        type :String
    } , adminId :{
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Admindqms"
    } ,instituteDetails :{
        type : Array
    }, institutionName :{
    type : String 
    } ,department : {
        type : String 
    }
},
    {timestamps:true });



export const User = mongoose.model("User" , user)
