import Router from "express" ;
import {adminsignup ,
     loginadmin , 
     logoutadmin ,
     addToQueue ,
     nextUser , 
     getQueueStatus ,
     deleteOne
    
    } from "../controllers/adminpanel.controllers.js";
import {checklogin} from "../middlewares/admin.auth.middlewares.js"
import { fetchQueueId } from "../middlewares/fetchQueueId.middlewares.js";

const adminRouter = Router() ;

adminRouter.route("/signup").post(adminsignup) // admin signup ka route
adminRouter.route("/login").post(loginadmin)//admin login ka route 

// get requests 
adminRouter.route("/logout").get(checklogin  , logoutadmin) //lout ka route 
adminRouter.route("/getQueueStatus").get(checklogin ,fetchQueueId ,getQueueStatus)
adminRouter.route("/nextUser").get(checklogin ,fetchQueueId ,nextUser)


adminRouter.route("/addToQueue").post(checklogin ,fetchQueueId ,addToQueue)
adminRouter.route("/deleteOne").delete(checklogin ,fetchQueueId ,deleteOne)




export { adminRouter }