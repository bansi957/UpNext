require("dotenv").config()
const mongoose=require("mongoose")

const db=async()=>{
    try {
        await mongoose.connect(process.env.DB);
        console.log("successfully connected")
    } catch (error) {
        console.log(error)
    }
}
module.exports=db;