// const express = require("express");
// const auth_middileware = require("../middleware/authMiddleware");
// const { 
//   getAllQuestions, 
//   createQuestion, 
//   getQuestionById,
//   updateQuestionStatus,
//   getMentorRequests,
//   getMyQuestions,
//   editQuestion,
//   deleteQuestion
// } = require("../controllers/question_controller");

// const questionRouter = express.Router();

// // Specific routes first (before :id)
// questionRouter.get("/all", getAllQuestions);
// questionRouter.get("/myquestions", auth_middileware, getMyQuestions);
// questionRouter.get("/mentor-requests", auth_middileware, getMentorRequests);

// // General routes
// questionRouter.post("/create", auth_middileware, createQuestion);
// questionRouter.put("/edit/:id", auth_middileware, editQuestion);

// questionRouter.delete("/delete/:id", auth_middileware, deleteQuestion);
// questionRouter.put("/update-status", auth_middileware, updateQuestionStatus);

// // Parameterized route last
// questionRouter.get("/:id",auth_middileware,getQuestionById);

// module.exports = questionRouter;

const express = require("express");
const auth_middileware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const { createQuestion, getMyQuestions, getQuestionById, editQuestion, deleteQuestion, getAllQuestions, updateQuestionStatus } = require("../controllers/question_controller");
const questionRouter = express.Router();


questionRouter.post("/create",auth_middileware,upload.single("image"),createQuestion)
questionRouter.get("/myquestions",auth_middileware,getMyQuestions)
// questionRouter.get("/assigned",auth_middileware,getAssignedQuestions)
questionRouter.get("/mentor-requests",auth_middileware,getAllQuestions)


questionRouter.put("/edit/:id",auth_middileware,upload.single("image"),editQuestion)
questionRouter.put("/update-status",auth_middileware,updateQuestionStatus)

questionRouter.delete("/delete/:id",auth_middileware,deleteQuestion)
questionRouter.get("/:id",auth_middileware,getQuestionById)


module.exports=questionRouter