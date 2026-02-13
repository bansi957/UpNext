const Chat=require("../models/chat_model")
const Question=require("../models/question_model")
const https = require("https")
const { URL } = require('url')
const axios = require("axios")
const cloudinary = require("cloudinary").v2
const crypto = require("crypto")

const uploadToCloudinary = require("../utils/cloudinary")
const User=require("../models/user_model")
const getMentorChats=async (req,res)=>{
    try {
        console.log("Fetching chats for mentor:", req.userId);
        
        const chats = await Chat.find({ mentor: req.userId })
          .populate("student", "fullName email profileImage isOnline")
          .populate("question", "title")
          .sort({ createdAt: -1 });

        console.log("Chats found:", chats.length);
        
        const formattedChats = chats.map(chat => ({
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            questionId: chat.question?._id || null,
            question: chat.question || null,
            status: chat.status,
            rating: chat.rating,
            ratedAt: chat.ratedAt,
            messages: chat.messages || [],
            lastMessage: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].content 
                : "No messages yet",
            lastMessageTime: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].createdAt 
                : chat.createdAt,
            unreadCount: chat.messages?.filter(msg => msg.senderRole === 'student' && !msg.isRead).length || 0,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));

        return res.status(200).json(formattedChats)
    } catch (error) {
        console.error("Error in getMentorChats:", error);
        return res.status(500).json({message:`gettingmentor chats error ${error.message || error}`})
    }
}

const getStudentChats=async (req,res)=>{
    try {
        const chats = await Chat.find({ student: req.userId })
          .populate("mentor", "fullName email profileImage isOnline")
          .populate("question", "title")
          .sort({ createdAt: -1 });

        const formattedChats = chats.map(chat => ({
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            questionTitle: chat.question?.title || "Untitled Question",
            status: chat.status,
            rating: chat.rating,
            ratedAt: chat.ratedAt,
            messages:chat.messages,
            questionId:chat.question?._id,

            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            lastMessage: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].content 
                : "No messages yet",
            lastMessageTime: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].createdAt 
                : chat.createdAt,
            unreadCount: chat.messages?.filter(msg => msg.senderRole === 'mentor' && !msg.isRead).length || 0,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));

        return res.status(200).json(formattedChats)
    } catch (error) {
        console.error("Error in getStudentChats:", error);
        return res.status(500).json({message:`getting student chats error ${error.message || error}`})
    }
}

const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId)
            .populate("student", "fullName email profileImage isOnline")
            .populate("mentor", "fullName email profileImage isOnline")
            .populate("question", "title");

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const formattedChat = {
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            questionId: chat.question?._id || null,
            question: chat.question || null,
            status: chat.status,
            rating: chat.rating,
            ratedAt: chat.ratedAt,
            messages: chat.messages || [],
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        };

        return res.status(200).json(formattedChat);
    } catch (error) {
        console.error("Error in getChatById:", error);
        return res.status(500).json({ message: `Error fetching chat: ${error.message || error}` });
    }
}

const getChatByQuestionId = async (req, res) => {
    try {
        const { questionId } = req.params;
        const chat = await Chat.findOne({question:questionId})
            .populate("student", "fullName email profileImage isOnline")
            .populate("mentor", "fullName email profileImage isOnline")
            .populate("question", "title");

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const formattedChat = {
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            questionId: chat.question?._id || null,
            question: chat.question || null,
            status: chat.status,
            rating: chat.rating,
            ratedAt: chat.ratedAt,
            messages: chat.messages || [],
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        };

        return res.status(200).json(formattedChat);
    } catch (error) {
        console.error("Error in getChatByQuestionId:", error);
        return res.status(500).json({ message: `Error fetching chat: ${error.message || error}` });
    }
}

const createChat=async (req,res)=>{
    try {
        const {chatId}=req.params
        const chat=await Chat.findById(chatId)
        const newMessage=req.body
        if(!chat){
            return res.status(400).json({message:"chat not found"})
        }

        let messageContent = newMessage.text || "";
        let messageType = "text";
        let fileUrl = null;

        if(req.file) {
            try {
                fileUrl = await uploadToCloudinary(req.file.path, req.file.mimetype);
                messageType = req.file.mimetype.startsWith('image/') ? "image" : "file";
                
                if(!messageContent.trim()) {
                    messageContent = req.file.originalname;
                }
            } catch (uploadError) {
                console.error("File upload error:", uploadError);
                return res.status(500).json({message: "Failed to upload file"});
            }
        }

        const messageData = {
            sender: req.userId,
            senderRole: newMessage.sender,
            content: messageContent,
            messageType: messageType
        };

        if(fileUrl) {
            messageData.fileUrl = fileUrl;
            messageData.fileName = req.file.originalname;
        }

        chat.messages.push(messageData);

        // Mark all UNREAD messages from opposite person as READ
        const oppositeRole = newMessage.sender === 'mentor' ? 'student' : 'mentor';
        chat.messages.forEach(msg => {
            if (msg.senderRole === oppositeRole && !msg.isRead) {
                msg.isRead = true;
            }
        });

        await chat.save();
        await chat.populate('mentor');
        await chat.populate('student');
        
        // Calculate new unread counts
        const mentorUnreadCount = chat.messages?.filter(msg => msg.senderRole === 'student' && !msg.isRead).length || 0;
        const studentUnreadCount = chat.messages?.filter(msg => msg.senderRole === 'mentor' && !msg.isRead).length || 0;
        
        const io=req.app.get('io')
        if(io){
            io.emit('send-message',{
                chatId:chat._id,
                sender:messageData.senderRole,
                mentorId: chat.mentor._id,
                studentId: chat.student._id,

                messages:chat.messages||[],
                mentorUnreadCount: mentorUnreadCount,
                studentUnreadCount: studentUnreadCount
            })
        }

        // Get the actual saved message with its _id
        const savedMessage = chat.messages[chat.messages.length - 1];

        const responseMessage = {
            _id: savedMessage._id, // Include the MongoDB _id
            sender: req.userId,
            senderRole: newMessage.sender,
            content: messageContent,
            messageType: messageType,
            createdAt: savedMessage.createdAt
        };

        if(fileUrl) {
            responseMessage.fileUrl = fileUrl;
            console.log(req.file)
            responseMessage.fileName = req.file.originalname;
        }

        return res.status(200).json(responseMessage)
    } catch (error) {
         console.error("Error in createChat:", error);
        return res.status(500).json({ message: `Error creating chat: ${error.message || error}` });
    }
}

const markMessagesAsRead = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { messageIds } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.messages.forEach(msg => {
            if (messageIds.includes(msg._id.toString())) {
                msg.isRead = true;
            }
        });

        await chat.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('messages-read', { chatId: chat._id, messageIds });
        }

        return res.status(200).json({ message: "Messages marked as read", chat });
    } catch (error) {
        console.error("Error in markMessagesAsRead:", error);
        return res.status(500).json({ message: `Error marking messages as read: ${error.message || error}` });
    }
}

const completeChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: 'completed' },
      { new: true }
    )
    .populate("student", "fullName email profileImage isOnline socketId")
    .populate("mentor", "fullName email profileImage isOnline socketId");

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    const question=await Question.findByIdAndUpdate(chat.question,{status:"completed"},{new:true})

    const io = req.app.get('io')
    if (io) {
      if (chat.student?.socketId) {
        io.to(chat.student.socketId).emit('chat-completed', { chatId: chat._id })
      }
      if (chat.mentor?.socketId) {
        io.to(chat.mentor.socketId).emit('chat-completed', { chatId: chat._id })
      }
    }

    res.status(200).json(chat)
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete chat' })
  }
}

const rateMentor = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.rating = rating;
    chat.ratedAt = new Date();
    await chat.save();

    await chat.populate("student", "fullName email profileImage isOnline");
    await chat.populate("mentor", "fullName email profileImage isOnline socketId rating studentsHelped");
    await chat.populate("question", "title");

    const io = req.app.get('io');
    if (io && chat.mentor?.socketId) {
      io.to(chat.mentor.socketId).emit('rating-received', { 
        chatId: chat._id, 
        rating: chat.rating 
      });
    }
    const r=((chat.mentor.rating*chat.mentor.studentsHelped)+rating)/(chat.mentor.studentsHelped+1)
    const finalRating = Number(r.toFixed(2));
    const user=await User.findByIdAndUpdate(chat.mentor._id,{rating:finalRating,studentsHelped:chat.mentor.studentsHelped+1},{new:true})
    return res.status(200).json({ 
      message: "Rating submitted successfully", 
      chat,
      rating: chat.rating,
      ratedAt: chat.ratedAt
    });
  } catch (error) {
    console.error("Error in rateMentor:", error);
    return res.status(500).json({ message: `Error submitting rating: ${error.message || error}` });
  }
}

const downloadFile = async (req, res) => {
  try {
    const { chatId, messageId } = req.params;
    
    console.log(`[DOWNLOAD] Request: chatId=${chatId}, messageId=${messageId}`);
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      console.log(`[DOWNLOAD] Chat not found: ${chatId}`);
      return res.status(404).json({ message: "Chat not found" });
    }

    const message = chat.messages.find(msg => msg._id.toString() === messageId);
    if (!message || !message.fileUrl) {
      console.log(`[DOWNLOAD] Message or file URL not found`);
      return res.status(404).json({ message: "File not found" });
    }

    const fileName = message.fileName || 'file';
    let fileUrl = message.fileUrl;
    
    console.log(`[DOWNLOAD] File URL: ${fileUrl}`);
    console.log(`[DOWNLOAD] File name: ${fileName}`);

    // Add Cloudinary parameters to force download behavior
    // fl_attachment forces content-disposition: attachment
    // q_auto optimizes quality
    const downloadUrl = `${fileUrl}?fl_attachment`;
    
    console.log(`[DOWNLOAD] Redirect URL: ${downloadUrl}`);
    
    // Redirect with Content-Disposition header to force browser download
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    
    console.log(`[DOWNLOAD] Serving file as attachment: ${fileName}`);
    return res.redirect(downloadUrl);
    
  } catch (error) {
    console.error(`[DOWNLOAD] Error: ${error.message}`);
    if (!res.headersSent) {
      return res.status(500).json({ message: `Error downloading file: ${error.message}` });
    }
  }
}

module.exports={completeChat,getMentorChats,getStudentChats,getChatById,getChatByQuestionId,createChat,markMessagesAsRead,rateMentor,downloadFile}