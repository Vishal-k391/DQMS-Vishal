import { Admindqms } from "../models/admin.details.models.js";
import { Queue } from "../models/queue.models.js"
import { User } from "../models/users.models.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import {errorResponse} from "../utils/errorResponse.js"
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const generateTokens = async function (id){
    //needd the refrence oft the object admin

    const admin = await Admindqms.findById(id);
    console.log(admin)
    try {
        console.log(process.env.ADMIN_SECRET_A)
        const accessToken =  await admin.generateAToken();
        const refreshToken =  await admin.generateRToken();
        console.log(accessToken ,refreshToken)
        console.log("check 1 ")

        // db changes 
         admin.refreshToken = refreshToken ;
        await admin.save({validateBeforeSave : false})
        return {refreshToken , accessToken};
    } catch (error) {
        throw new errorResponse(501,  "error in jwt token generation")
    }
}
//controller for admin signnup 
const adminsignup = asyncHandler(async function (req ,res){
    //inpur //validate //entry in db 
    let { fullname_admin , email , password ,institutionName , department} = req.body  ;
     //validation of values 
     if (!(fullname_admin && email && password && institutionName && department)){
        throw new errorResponse(401 , "some info missing")
     } 
     
     
     // checking @ in email
     if (!email.includes("@")){
        throw new errorResponse(401, "invalid email")
     }
     fullname_admin = fullname_admin.toLowerCase().trim()
     institutionName = institutionName.toLowerCase().trim()
     department = department.toLowerCase().trim()
     email = email.toLowerCase().trim();

     // checking if already exists or not 
     const exists_or_not = await Admindqms.findOne({email});
    if (exists_or_not){
        throw new errorResponse(401, "this user already exits ")
    }
    /// make new db entry 
    const user = await Admindqms.create({
        fullname_admin:fullname_admin ,
        email : email ,
        password :password ,
        institutionName:institutionName ,
        department : department
    });
    console.log(user)
    if (!user._id){
        throw new errorResponse(501 ,"error in admin signup")
    }
    
    const createdUser = await Admindqms.findById(user._id).select("-password -refreshToken");

    ///admin succ 
    return res.status(201).json(new apiResponse(200 , createdUser , "admin succesfully created in "));


})

const loginadmin = asyncHandler(async function(req, res){
    //input 
    // validatioon checks , exists or noty , password check , if true
    // generate access and refresh token store refresh token in db .then cookie se send kar response 
    const {email , password } = (req.body) ;
    if (!(email && password)){
        throw new errorResponse(401, "enter all info")
    }
    // checking if user exists 
    const exists = await Admindqms.findOne({email});
    if (!exists){
        throw new errorResponse(401, "user hasnt signup")
    }
    // password check 
    const passcheck = await exists.isPasswordCorrect(password);
    if (!passcheck){
        throw new errorResponse(401, "the password isnt correct");
    }

    // generating access token and refresh token 
    const {refreshToken, accessToken} = await generateTokens(exists._id)
    const logedin = await Admindqms.findById(exists._id).select("-password");

    if (!logedin){
        throw new errorResponse(502, "error in final db call")
    }
     
    const cookieopt = {
        httpOnly : true ,
        secure : true

    }
    return res
    .status(200)
    .cookie("accessToken" , accessToken , cookieopt)
    .cookie("refreshToken" , refreshToken ,cookieopt)
    .json(new apiResponse(200 , logedin , "user succesfully loged in "))    


})

const logoutadmin = asyncHandler(async function (req, res) {
    const adminid  = req.admin._id ;
    const admin = await Admindqms.findByIdAndUpdate(adminid 
        , {
            $set :{refreshToken :"0"}
        } ,{
            returnDocument: "after" 
        }
    ).select("-password");
    console.log(admin)
    if (!admin){
        throw new errorResponse(501, "error in logout reftoken nulling")
    }
    // res with clear cookioe 
    const cookieOpt = {
        httpOnly : true ,
        secure : true

    }
   return res.status(200)
    .clearCookie("accessToken" , cookieOpt)
    .clearCookie("refreshToken" , cookieOpt).json(new apiResponse(200 , admin , "user loged out "))
    
})

const generateUID = function(phone){
    if (!phone){
        phone = (Math.random() * (Math.pow(10 ,10)))
    }
  let str = String(phone );
  let hash = Math.random() * 100;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffff; // keep within 16 bits
  }

  return hash.toString(16).padStart(4, '0').toLowerCase();

}

const addToQueue = asyncHandler(async function (req , res ){
    //check queue if eempty or not 
    // if empty then .create and inject the queue id in user
    ///create user profile 
    // keeping the ip inn the form of [{},{},{}]
    // if not empty then $add to set 
    let {fullname_user ,phone ,uniqueid ,tokenNo , queueId ,adminId} = req.body ;
    if (!(fullname_user.trim())){
        throw new errorResponse(401, "error in name in addtoqueue controller ")
    }
   
    if (phone && (String(phone).length !== 10)){
        throw new errorResponse(401, "the phone no is of incorrect size ")
    }else {
    }
    /// generating the unique id 

    fullname_user = String(fullname_user).trim().toLowerCase()////remember how we're storin the user name 

    let uidflag = true ;
    while(uidflag)
    {
        uniqueid = generateUID(phone);
        const exists_or_not = await User.findOne({uniqueid});
        if (!exists_or_not){
            break;
        }
    }    
    // calcullatig the token number 
    tokenNo = Number(req.queue_length) + 1;
    queueId = req.queueId ;
    adminId = req.admin._id;
    
    const adminAccess = await Admindqms.findById(req.admin._id);

    if (!adminAccess){
        throw new errorResponse(501, "in add to Queue controller ")
    }
    const institutionName = adminAccess.institutionName;
    const department  = adminAccess.department
    // creating a user 
    const user = await User.create({
        fullname_user , 
        phone , 
        uniqueid ,
        tokenNo ,
        queueId ,
        adminId ,
        institutionName:institutionName ,
        department : department
    })
    if (!user._id){
        throw new errorResponse(501, "error in admin controller in addtoqueue")
    }

    // pipeline for returning the detaiils of admin
    const pipelineResult = await User.aggregate([{
        $match :{
            _id : new mongoose.Types.ObjectId(user._id)
        }
    },{
        $lookup:{
            from : "admindqms" , 
            localField : "adminId" ,
            foreignField : "_id",
            as : "instituteDetails" ,
            pipeline :[
                {
                    $project:{
                        department : 1 ,
                        institutionName : 1 , 
                        _id : 0
                    }
                } ,
            ]
        }
    } , {
        $addFields:{
            instituteDetails : {$arrayElemAt : ["$instituteDetails" , 0]}
        }
    },{
        $project :{
            instituteDetails : 1 ,
            fullname_user :1 , 
            phone :1 , 
            uniqueid : 1 ,
            tokenNo :1  ,
            institutionName :1 ,
            department : 1

        }
    }])


   return res.status(201).json(
        new apiResponse(201 , pipelineResult[0] , "new user successfully added to the queue")
    )


})

const nextUser = asyncHandler(async function (req, res) {
    if (req.queue_length <= 0 ){
        throw new errorResponse(401 , "no user to added in queue..add some then next")
    }
    const delFirstObj = await User.findOneAndDelete({
        tokenNo  : 1
    } , {
        projection :{
            fullname_user : 1 ,
            _id : 0 ,
            uniqueid : 1 ,  
        }
    })
    if (!delFirstObj){
        throw new errorResponse(501 , "in nextUser in del first object error")
    }

   const update = await User.updateMany({
        queueId : new mongoose.Types.ObjectId(req.queueId)
    } ,{
        $inc:{
            tokenNo : -1
        }
    })
    if (!update){
        throw new errorResponse(501, "in nextUser in update Many ")
    }    
    
    
    return res.status(200).json(
        new apiResponse(200 , delFirstObj , "queue moved forward ")
    )
    
})

const getQueueStatus = asyncHandler(async function (req, res ) {
    if (req.queue_length <= 0 ){
        throw new errorResponse(401 , "no user to added in queue..add some then next")
    } 

    console.log("checking pipeline entry")
    const pipelineResult = await Queue.aggregate([
        {
            $match:{
                _id  : new mongoose.Types.ObjectId(req.queueId)/// wrap around ObjectId so that code doesnt break ,TBR
            } 
        },
        {
            $lookup :{
                from : "users" ,
                localField :"_id" ,
                foreignField : "queueId" ,
                as : "queue_status",
                pipeline : [{
                    $sort :{tokenNo : 1}
                },{
                    $project:{
                        fullname_user : 1,
                        phone : 1 , 
                        uniqueid :  1, 
                        tokenNo: 1 , 
                        _id : 0 , 
                    }
                },]
            }
        } , 
        {
            $project : {
                queue_status : 1 ,
                adminId :1 ,
                institutionName :1 ,
                department :1 ,
                _id : 0
            }
        }
    ]);
    if (!pipelineResult.length){
        throw new errorResponse(501, "in getQueueStatus in pipelineResult")
    }
    return res.status(200).json(new apiResponse(200 , pipelineResult[0] , "the operation was successful. Queue status returned"))

})

const deleteOne = asyncHandler(async function (req, res) {
    //deleting via uniqueid
    if (req.queue_length <= 0 ){
        throw new errorResponse(401 , "no user to added in queue..add some then perform delete")
    } 
    let {uniqueid} = req.body;//--{2}
    uniqueid = uniqueid.toLowerCase();
    if (!uniqueid){
        throw new errorResponse(401, "user hasnt given the unique id")
    } 

    // validating if it exists or not 
    const existsOrNot = await User.findOne({uniqueid}); // returns null if doesnt exist
    console.log(existsOrNot)
    if (!existsOrNot){
        throw new errorResponse(401 , "this user doesnt exist in the db")
    }

    const deletedUser  = await User.findOneAndDelete({uniqueid})
    if (!deletedUser){
        throw new errorResponse(501, "error in deleteOne controller in deletedUser call")
    }
    const updateUsers = await User.updateMany({
        queueId  : req.queueId ,
        tokenNo : {$gt : deletedUser.tokenNo}
    } ,{
        $inc :{tokenNo : -1}
    })
    if (!updateUsers){
         throw new errorResponse(501, "error in deleteOne controller in updateUsers call")
    }
    return res.status(200).json(
        new apiResponse(200 , deletedUser, "user successfully nuked")
    )

})

const bulkdelete = asyncHandler(async function (req ,res) {
    
})

export {adminsignup ,
     loginadmin , 
     logoutadmin ,
     addToQueue ,
     nextUser , 
     getQueueStatus ,
     deleteOne
    
    }