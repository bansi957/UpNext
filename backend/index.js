require("dotenv").config()
const express=require("express")
const db = require("./database/db")
const cors=require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth_routes")
const questionRouter = require("./routes/question_routes")
const chatRouter = require("./routes/chat_routes")
const app=express()
const port=process.env.PORT||3000
const {Server}=require("socket.io")
const {createServer}=require("http")
const { socketHandler } = require("./socket")
const server=createServer(app)


const io=new Server(server,{cors:{
    origin:"https://upnext-dzd9.onrender.com",
    // origin:"http://localhost:5173",
    credentials:true,
    methods:['POST','GET','PUT','DELETE']
}})


app.set("io",io)
app.use(cors({
    origin:"https://upnext-dzd9.onrender.com",
        // origin:"http://localhost:5173",

    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


app.use("/api/auth",authRouter)
app.use("/api/questions",questionRouter)
app.use("/api/chats",chatRouter)













socketHandler(io)

server.listen(port,()=>{
    db()
    console.log(`server start at ${port}`)
})
