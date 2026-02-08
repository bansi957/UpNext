const mongoose=require("mongoose");
const validator = require("validator");

const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
      type: String,
      unique:true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address: " + value);
        }
      },
    },
    password:{
        type:String,
        trim:true,
        required:true,
    },
    role:{
        type:String,
        enum:["student","mentor"],
        default:"student"
    },
    phone:{
      type:String
    },
    location:{
      type:String
    },
    bio:{
      type:String
    },
    college:{
      type:String
    },
    branch:{
      type:String
    },
    year:{
      type:String
    },
    rollNumber:{
      type:String
    },
    cgpa:{
      type:Number,
      min:0,
      max:10
    },
    domain:{
      type:String
    },
    skills:{
      type:[String],
      default:[]
    },
    interests:{
      type:[String],
      default:[]
    },
    experience:{
      type:String
    },
    github:{
      type:String,
      validate: v => !v || validator.isURL(v)
    },
    linkedin:{
      type:String,
       validate: v => !v || validator.isURL(v)
    },
    portfolio:{
      type:String,
       validate: v => !v || validator.isURL(v)
    },
    careerGoal:{
      type:String
    },
    lookingFor:{
      type:[String],
      default:[]
    },
    profileImage:String,
    profileCompletion:{
      type:Number,
      default:25
    },
    tagline:{
      type:String
    },
    company:String,
    position:String,
    yearsOfExperience:Number,
    teaching_style:String,
    achievements:String,
    mentorshipFocus:[String],
    rating:{
      type:Number,
      default:0
    },
     studentsHelped:{
      type:Number,
      default:0
    },
    socketId:{
      type:String,
      
    },
    isOnline:{
      type:Boolean,
      default:false
    }


}, { timestamps: true })

module.exports=mongoose.model("User",userSchema)