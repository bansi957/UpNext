const Question=require("../models/question_model")
const uploadToCloudinary = require("../utils/cloudinary")
const Chat=require("../models/chat_model")

const createQuestion=async (req,res)=>{
    try {
        const data=req.body
        const userId=req.userId
        const acceptedData=["title","description","category","tags","questionType","targetMentorId"]
        const formdata={}
        for(let field of acceptedData){
            if(data[field]!==undefined){
                formdata[field]=data[field]
            }
        }
        formdata.author=userId
        
        // Map targetMentorId to targetMentor for database
        if(formdata.targetMentorId){
            formdata.targetMentor=formdata.targetMentorId
            delete formdata.targetMentorId
        }
        
        if(req.file){
            const imageUrl=await uploadToCloudinary(req.file.path)
            formdata.attachment=imageUrl
        }
        const question=await Question.create(formdata)
        const io=req.app.get('io')
        if(io){
          io.emit('send-request',{question})
        }
        return res.status(200).json({message:"successfully question posted",question})
    } catch (error) {
        return res.status(500).json(error)
    }
}


const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate("author", "fullName email profileImage")
      .populate("targetMentor", "fullName email profileImage domain position");
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching question", error: error.message });
  }
};

const editQuestion=async (req,res)=>{
    try {
        const data=req.body
        const {id}=req.params
        const acceptedData=["title","description","category","tags"]
        const formdata={}
        for(let field of acceptedData){
            if(data[field]!==undefined){
                formdata[field]=data[field]
            }
        }
        
        if(req.file){
            const imageUrl=await uploadToCloudinary(req.file.path)
            formdata.attachment=imageUrl
        }
        const question=await Question.findByIdAndUpdate(id,formdata,{
      new: true,
      runValidators: true,
    })
        return res.status(200).json({message:"successfully question updated",question})
    } catch (error) {
        return res.status(500).json(error)
    }
}

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // 🗑️ Delete attachment from Cloudinary if exists
    if (question.attachment) {
      const publicId = question.attachment
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; 
      // example: UpNext/oli4nhjjyvsbyzxhsxzf

      await cloudinary.uploader.destroy(publicId);
    }

    await Question.findByIdAndDelete(id);

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Delete question error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




const getAllQuestions = async (req, res) => {
  try {
    const mentorId = req.userId;
    
    // Pending questions open to all mentors
    const allquestions = await Question.find({
      questionType: "all",
      status: "pending"
    })
      .populate("author", "fullName email profileImage")
      .sort({ createdAt: -1 });
    
    // Accepted questions by this mentor
    const acceptedQuestions = await Question.find({
      questionType: "all",
      status: "accepted",
      assignedTo: mentorId
    })
      .populate("author", "fullName email profileImage")
      .sort({ createdAt: -1 });
    
    // Specific questions targeted to this mentor (both pending and accepted)
    const specificQuestions = await Question.find({
      targetMentor: mentorId,
      questionType: "specific"
    })
      .populate("author", "fullName email profileImage")
      .sort({ createdAt: -1 });
    
    const questions = [...allquestions, ...acceptedQuestions, ...specificQuestions];
    questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (questions.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching questions",
      error: error.message,
    });
  }
};

const getMyQuestions = async (req, res) => {
  try {
    const userId = req.userId;
    const questions = await Question.find({ author: userId })
      .populate("author", "fullName email profileImage")
      .sort({ createdAt: -1 });

      if (!questions) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching your questions", error: error.message });
  }
};

// const getAssignedQuestions = async (req, res) => {
//   try {
//     const mentorId = req.userId;
//     const questions = await Question.find({ 
//       targetMentor: mentorId,
//       questionType: "specific"
//     })
//       .populate("author", "fullName email profileImage")
//       .populate("targetMentor", "fullName email profileImage domain")
//       .sort({ createdAt: -1 });

//     if (questions.length === 0) {
//       return res.status(200).json([]);
//     }
    
//     return res.status(200).json(questions);
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching assigned questions", error: error.message });
//   }
// };

const updateQuestionStatus=async(req,res)=>{
  try {
    const {status,mentorId,questionId}=req.body
  const q=await Question.findById(questionId)
  if(q.status=="accepted"){
    return status(400).json({message:"this question was already accepted by another mentor"})
  }
    const chat=await Chat.create({mentor:req.userId,student:q.author,question:q._id})
    const question=await Question.findByIdAndUpdate(questionId,{status,assignedTo:mentorId},{new:true})
    res.status(200).json({question ,chatId:chat._id})
  } catch (error) {
       return res.status(500).json({ message: "Error status updating", error: error.message });

  }
}

module.exports={createQuestion, getMyQuestions, getQuestionById,updateQuestionStatus, editQuestion, deleteQuestion, getAllQuestions}