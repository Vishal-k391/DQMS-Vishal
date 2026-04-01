import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const admin_model = new mongoose.Schema({
    fullname_admin : {
        type : String , 
        required : true 
    } ,
    email : {
        type : String ,
        required : true, 
        unique : true 

    },
    password :{
        type : String , 
        required :true 
    } , 
    refreshToken :{
        type : String , 
    }, institutionName :{
        type : String ,
        required : true  ,
        
    },queueId:{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Queue", 
    } ,department :{
        type : String , 
        required : true 
    }
},{timestamps :true })

// password hashing 
admin_model.pre("save" , async function(){
    if (this.isModified("password")) {
        this.password  = await bcrypt.hash(this.password , 10)
    }
})

// verify password method 
admin_model.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password);
}

admin_model.methods.generateAToken = async  function(){
    return  await jwt.sign(
        {
            _id : this._id ,
            fullname_admin : this.fullname_admin ,
            
        },
        process.env.ADMIN_SECRET_A,
        {
            expiresIn : `${process.env.ADMIN_EXPIRY_A}`
        }
    )
}

admin_model.methods.generateRToken = async  function(){
    return await jwt.sign(
        {
            _id : this._id
        },
        process.env.ADMIN_SECRET_R,
        {
            expiresIn : `${process.env.ADMIN_EXPIRY_R}`
        }
    )
}
export const Admindqms = mongoose.model("Admindqms", admin_model);