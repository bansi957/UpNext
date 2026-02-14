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
      .populate("targetMentor", "fullName email profileImage domain position")
      .populate("acceptedBy", "fullName email profileImage domain position");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    return res.status(500).json({ message: `Error: ${error.message || error}` });
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
    const { filter } = req.query;
    
    console.log('getAllQuestions called with mentorId:', mentorId, 'filter:', filter);

    let questions = [];

    if (filter === "specific") {
      // Only specific (For You) questions
      questions = await Question.find({
        targetMentor: mentorId,
        questionType: "specific"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });
      console.log('Specific questions found:', questions.length);
    } else if (filter === "pending") {
      // Only pending questions
      const allPending = await Question.find({
        questionType: "all",
        status: "pending"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const specificPending = await Question.find({
        targetMentor: mentorId,
        questionType: "specific",
        status: "pending"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      console.log('Pending questions - all:', allPending.length, 'specific:', specificPending.length);
      questions = [...allPending, ...specificPending];
    } else if (filter === "accepted") {
      // Only accepted questions
      const allAccepted = await Question.find({
        questionType: "all",
        status: "accepted",
        acceptedBy: mentorId
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const specificAccepted = await Question.find({
        targetMentor: mentorId,
        questionType: "specific",
        status: "accepted"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      console.log('Accepted questions - all:', allAccepted.length, 'specific:', specificAccepted.length);
      questions = [...allAccepted, ...specificAccepted];
    } else if (filter === "completed") {
      // Only completed questions
      const allCompleted = await Question.find({
        questionType: "all",
        status: "completed",
        acceptedBy: mentorId
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const specificCompleted = await Question.find({
        targetMentor: mentorId,
        questionType: "specific",
        status: "completed"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      console.log('Completed questions - all:', allCompleted.length, 'specific:', specificCompleted.length);
      questions = [...allCompleted, ...specificCompleted];
    } else {
      // No filter or filter === "all" - show everything
      const allPending = await Question.find({
        questionType: "all",
        status: "pending"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const allAccepted = await Question.find({
        questionType: "all",
        status: "accepted",
        acceptedBy: mentorId
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const allCompleted = await Question.find({
        questionType: "all",
        status: "completed",
        acceptedBy: mentorId
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      const specificQuestions = await Question.find({
        targetMentor: mentorId,
        questionType: "specific"
      })
        .populate("author", "fullName email profileImage")
        .sort({ createdAt: -1 });

      console.log('All filter - pending:', allPending.length, 'accepted:', allAccepted.length, 'completed:', allCompleted.length, 'specific:', specificQuestions.length);
      questions = [
        ...allPending,
        ...allAccepted,
        ...allCompleted,
        ...specificQuestions
      ];
    }

    questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log('Total questions to return:', questions.length);

    if (questions.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error('Error in getAllQuestions:', error);
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
      .populate("targetMentor", "fullName email profileImage")
      .sort({ createdAt: -1 });

    if (!questions) {
      return res.status(404).json({ message: "No questions found" });
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getMyQuestions:", error);
    return res.status(500).json({ message: `Error: ${error.message || error}` });
  }
};

const getMentorRequests = async (req, res) => {
  try {
    const mentorId = req.userId;

    // Get all questions where mentor is targeted OR questions open to all mentors
    const questions = await Question.find({
      $or: [
        { targetMentor: mentorId, questionType: "specific" },
        { questionType: "all" }
      ]
    })
      .populate("author", "fullName email profileImage")
      .populate("targetMentor", "fullName email profileImage")
      .sort({ createdAt: -1 });

    if (!questions) {
      return res.status(404).json({ message: "No questions found" });
    }

    return res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getMentorRequests:", error);
    return res.status(500).json({ message: `Error: ${error.message || error}` });
  }
};

const updateQuestionStatus = async (req, res) => {
  try {
    const { questionId, status, mentorId } = req.body;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { status, acceptedBy: mentorId },
      { new: true }
    ).populate("author", "fullName email profileImage isOnline socketId");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // If status is 'accepted', create a chat
    if (status === "accepted") {
      const Chat = require("../models/chat_model");
      
      // Check if chat already exists
      let chat = await Chat.findOne({ question: questionId });
      
      if (!chat) {
        chat = new Chat({
          mentor: mentorId,
          student: question.author._id,
          question: questionId,
          status: "started",
          messages: []
        });
        await chat.save();
      }

      // Populate chat with full details
      await chat.populate("mentor", "fullName email profileImage isOnline socketId");
      await chat.populate("student", "fullName email profileImage isOnline socketId");
      await chat.populate("question", "title");

      // Format chat data for frontend
      const formattedChat = {
        _id: chat._id,
        mentor: chat.mentor,
        student: chat.student,
        studentName: chat.student?.fullName || "Unknown",
        mentorName: chat.mentor?.fullName || "Unknown",
        questionTitle: chat.question?.title || "Untitled Question",
        status: chat.status,
        rating: chat.rating || null,
        ratedAt: chat.ratedAt || null,
        studentIsOnline: chat.student?.isOnline || false,
        mentorIsOnline: chat.mentor?.isOnline || false,
        lastMessage: "No messages yet",
        lastMessageTime: chat.createdAt,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messages: chat.messages || []
      };

      // Emit socket event to student to create chat in real-time
      const io = req.app.get('io');
      if (io && question.author?.socketId) {
        io.to(question.author.socketId).emit('new-chat', { chat: formattedChat });
      }

      return res.status(200).json({
        message: "Question accepted and chat created",
        question,
        chatId: chat._id,
        chat: formattedChat
      });
    }

    return res.status(200).json({
      message: "Question status updated",
      question
    });
  } catch (error) {
    console.error("Error in updateQuestionStatus:", error);
    return res.status(500).json({ message: `Error: ${error.message || error}` });
  }
};

module.exports = { 
  getAllQuestions, 
  createQuestion, 
  getQuestionById,
  updateQuestionStatus,
  getMentorRequests,
  getMyQuestions,
  editQuestion,
  deleteQuestion
};

