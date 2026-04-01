import express, { urlencoded } from "express"
import cookieParser  from "cookie-parser";
import cors from "cors"

const app = express();

const options_c= {
    options : process.env.CORS_OPTIONS ,
}
app.use(express.json({
    limit :"1kb"
}))
app.use(cors(options_c))
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())

// routes declaration after middlewares loaded
import { adminRouter, } from "./routes/adminpanel.routes.js";
//admin routes 
app.use(["/api/v1/admin"] , adminRouter)

//user routes 
import { userRouter } from "./routes/user.routes.js";

app.use(["/api/v1/user"] , userRouter)



export{ app }

