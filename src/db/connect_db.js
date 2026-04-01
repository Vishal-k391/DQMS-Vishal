import mongoose from "mongoose"
import { db_name } from "../constants.js"

const connect_db = async function () {
    try{
        let url = process.env.DB_URL ;
        await mongoose.connect(`${url}/${db_name}`);
        console.log("db connected ");
        return;
    }catch(error){
        console.log("the db aint connecting ")        
        process.exit(1)
    }
}

export {connect_db}