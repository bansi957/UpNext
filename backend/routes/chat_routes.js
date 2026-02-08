const express=require("express")
const auth_middileware = require("../middleware/authMiddleware")
const { getMentorChats, getStudentChats, getChatById, getChatByQuestionId, createChat, markMessagesAsRead } = require("../controllers/chat_controller")
const chatRouter=express.Router()


chatRouter.get("/get-mentor-chats",auth_middileware,getMentorChats)
chatRouter.get("/get-student-chats",auth_middileware,getStudentChats)
chatRouter.get("/question/:questionId",auth_middileware,getChatByQuestionId)
chatRouter.post("/send-message/:chatId",auth_middileware,createChat)
chatRouter.post("/mark-read/:chatId",auth_middileware,markMessagesAsRead)
chatRouter.get("/:chatId",auth_middileware,getChatById)



module.exports=chatRouter