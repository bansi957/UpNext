const express = require("express");
const { signUp, signOut, signIn, googleauth, getCurrentUser, updateStudentDetails, getMentors } = require("../controllers/auth_controller");
const auth_middileware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const authRouter = express.Router();


authRouter.post("/signup",signUp);
authRouter.get("/signout",signOut);
authRouter.post("/signIn",signIn);
authRouter.post("/googleauth",googleauth);
authRouter.get("/getcurrentuser",auth_middileware,getCurrentUser);
authRouter.get("/getmentors",auth_middileware,getMentors);


authRouter.post(
  "/updateprofile",
  auth_middileware,
  upload.single("profileImage"),
  updateStudentDetails
);




module.exports=authRouter