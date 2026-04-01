import { userGetQueueStatus } from "../controllers/user.controllers.js";
import { Router } from "express";

const userRouter = Router();

userRouter.route("/statusCheck").post(userGetQueueStatus)


export {userRouter}

