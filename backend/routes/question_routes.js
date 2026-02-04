const express = require("express");
const auth_middileware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const { createQuestion, getMyQuestions, getQuestionById, editQuestion, deleteQuestion, getAllQuestions } = require("../controllers/question_controller");
const questionRouter = express.Router();


questionRouter.post("/create",auth_middileware,upload.single("image"),createQuestion)
questionRouter.get("/myquestions",auth_middileware,getMyQuestions)
questionRouter.get("/mentor-requests",auth_middileware,getAllQuestions)


questionRouter.put("/edit/:id",auth_middileware,upload.single("image"),editQuestion)
questionRouter.delete("/delete/:id",auth_middileware,deleteQuestion)
questionRouter.get("/:id",auth_middileware,getQuestionById)


module.exports=questionRouter