require("dotenv").config()
const express=require("express")
const db = require("./database/db")
const cors=require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth_routes")
const questionRouter = require("./routes/question_routes")
const app=express()
const port=process.env.PORT||3000

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRouter)
app.use("/api/questions",questionRouter)

















app.listen(port,()=>{
    db()
    console.log(`server start at ${port}`)
})
