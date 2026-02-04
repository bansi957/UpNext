const Question=require("../models/question_model")
const uploadToCloudinary = require("../utils/cloudinary")


const createQuestion=async (req,res)=>{
    try {
        const data=req.body
        const userId=req.userId
        const acceptedData=["title","descrption","category","tags"]
        const formdata={}
        for(i in acceptedData){
            if(data[i]!==undefined){
                formdata[i]=data[i]
            }
        }
        data.author=userId
        if(req.file){
            const imageUrl=await uploadToCloudinary(req.file.path)
            data.attachment=imageUrl
        }
        const question=await Question.create(data)
        return res.status(200).json({message:"successfully question posted",question})
    } catch (error) {
        return res.status(500).json(error)
    }
}


const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate("author", "fullName email profileImage");
    
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
        const acceptedData=["title","descrption","category","tags"]
        const formdata={}
        for(i in acceptedData){
            if(data[i]!==undefined){
                formdata[i]=data[i]
            }
        }
        
        if(req.file){
            const imageUrl=await uploadToCloudinary(req.file.path)
            data.attachment=imageUrl
        }
        const question=await Question.findByIdAndUpdate(id,data,{
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


// const getAllQuestions = async (req, res) => {
//   try {
//     const { category, tags, search } = req.query;
//     const filter = {};
    
//     if (category) filter.category = category;
//     if (tags) filter.tags = { $in: tags.split(",") };
//     if (search) filter.title = { $regex: search, $options: "i" };
    
//     const questions = await Question.find(filter)
//       .populate("author", "fullName email profileImage")
//       .sort({ createdAt: -1 });
    
//     return res.status(200).json(questions);
//   } catch (error) {
//     return res.status(500).json({ message: "Error fetching questions", error: error.message });
//   }
// };

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate("author").sort({createdAt:-1});

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found" });
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


module.exports={createQuestion, getMyQuestions,getQuestionById,editQuestion,deleteQuestion,getAllQuestions}