require("dotenv").config()
const validator = require("validator");
const  User  = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwtToken=require("jsonwebtoken");
const uploadToCloudinary = require("../utils/cloudinary")

const signUp=async (req,res)=>{
    try {
        const {fullName, email, password,role} = req.body;
  
        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({message:"user already exists please login"})
        }
        if(!validator.isStrongPassword(password)){
          return res.status(400).json({message:"password must contain  1 capital letter,1 special character,atleast of length 8"});
        }
        const passwordHash = await bcrypt.hash(password,10);

        user =await User.create({
          fullName,
          email,
          password:passwordHash,
          role
        })
        const token=await jwtToken.sign({userId: user._id.toString()},process.env.JWT_SECRET,{ expiresIn: "7d" })
        res.cookie("token",token,{
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })


        return res.status(200).json({message:"User created Successfully",user});

    } catch (error) {
        return res.status(500).json({message:`signUp ${error}`});
    }
}

const signIn=async (req,res)=>{
    try {
         const {email,password}=req.body
    let user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"User not found signUp first"});
    }
    const passMatch=await bcrypt.compare(password,user.password)
    if(!passMatch){
        return res.status(400).json({message:"Invalid Password"});
    }

        const token=await jwtToken.sign({userId: user._id.toString()},process.env.JWT_SECRET,{ expiresIn: "7d" })
        res.cookie("token",token,{
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })

        return res.status(200).json({message:"signin successful",user})
    } catch (error) {
          res.status(500).json({
            message:`signIn error ${error}`
        })
    }
   
}

const signOut=async (req,res)=>{
    try {
       res.clearCookie("token", {
  httpOnly: true,
  sameSite: "lax",
});
      return res.status(200).json({
            message:"successfully logout"
        })
    } catch (error) {
           res.status(500).json({
            message:`signOut error ${error}`
        })
    }
}

const googleauth=async(req,res)=>{
    try {
        const {fullName,email,role}=req.body
        let user=await User.findOne({email})
        if(user){
              const token=await jwtToken.sign({userId: user._id.toString()},process.env.JWT_SECRET,{ expiresIn: "7d" })
            res.cookie("token",token,{
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(200).json({message:"successfully login",user})
        }
        user=await User.create({fullName,email,role})
        const token=await jwtToken.sign({userId: user._id.toString()},process.env.JWT_SECRET,{ expiresIn: "7d" })
        res.cookie("token",token,{
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(200).json({message:"successfully signUp",user})
    } catch (error) {
        res.status(500).json({
            message:`googleauth error ${error}`
        })
    }
}

const getCurrentUser=async (req,res)=>{
    try {
        const user=await User.findById(req.userId)
       if(!user){
        return res.status(400).json({message:"User not found signUp first"});
    }

    return res.status(200).json(user)
    } catch (error) {
          res.status(500).json({
            message:`googleauth error ${error}`
        })
    }
}





const updateStudentDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedUpdates = [
      "fullName",
      "phone",
      "location",
      "bio",
      "college",
      "branch",
      "year",
      "rollNumber",
      "cgpa",
      "domain",
      "skills",
      "interests",
      "experience",
      "github",
      "linkedin",
      "portfolio",
      "careerGoal",
      "lookingFor",
      "profileCompletion",
      "tagline",
      "company",
    "position",
    "yearsOfExperience",
    "teaching_style",
    "achievements",
    "mentorshipFocus"

    ];

    let parsedFormData = {};
    if (req.body?.formData) {
      try {
        parsedFormData = JSON.parse(req.body.formData);
      } catch {
        return res.status(400).json({ message: "Invalid form data" });
      }
    }

    const updates = {};

    allowedUpdates.forEach((key) => {
      if (parsedFormData[key] !== undefined) {
        updates[key] = parsedFormData[key];
      }
    });

    // ✅ IMAGE UPLOAD
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      updates.profileImage = imageUrl;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


const getMentors=async (req,res)=>{
  try {
    const mentors=await User.find({role:"mentor",profileCompletion:{$gte:75}})
    if(!mentors){
      return res.status(400).json({message:"no mentors found"})
    }
    return res.status(200).json(mentors)
  } catch (error) {
    
  }
}

module.exports={signUp,signOut,signIn,googleauth,getCurrentUser,updateStudentDetails,getMentors}