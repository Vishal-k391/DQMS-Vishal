import dotenv from "dotenv" ;
dotenv.config({
    path : "./env"
});


import dns from "node:dns"
dns.setServers(["8.8.8.8" , "8.8.4.4"])

import { app } from "./app.js";
import { connect_db } from "./db/connect_db.js";

app.listen(process.env.PORT , ()=>{
    console.log(`server running at port ${process.env.PORT}`);
    connect_db()
})