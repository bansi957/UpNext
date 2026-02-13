const mongoose=require("mongoose")

const questionSchema=mongoose.Schema({
    title:{
      type:String,
      required:true
    },
    category:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true
    },
    tags:{
      type:[String],
      default:[]
    },
    attachment:{
      type:String,
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    status:{
      type:String,
      enum:["pending","accepted","completed"],
      default:"pending"
    },
    questionType:{
      type:String,
      enum:["all","specific"],
      default:"all"
    },
    targetMentor:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    },
    assignedTo:{
      type:mongoose.Schema.Types.ObjectId,
    },
    acceptedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      default:null
    }
}, {timestamps:true})

module.exports=mongoose.model("Question", questionSchema)