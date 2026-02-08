const Chat=require("../models/chat_model")

const getMentorChats=async (req,res)=>{
    try {
        console.log("Fetching chats for mentor:", req.userId);
        
        const chats = await Chat.find({ mentor: req.userId })
          .populate("student", "fullName email profileImage isOnline")
          .populate("question", "title")
          .sort({ createdAt: -1 });

        console.log("Chats found:", chats.length);
        
        // Format the response to include studentName and last message info
        const formattedChats = chats.map(chat => ({
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            status: chat.status,
            lastMessage: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].content 
                : "No messages yet",
            lastMessageTime: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].createdAt 
                : chat.createdAt,
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

        
        // Format the response to include studentName and last message info
        const formattedChats = chats.map(chat => ({
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            questionTitle: chat.question?.title || "Untitled Question",
            status: chat.status,
            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            lastMessage: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].content 
                : "No messages yet",
            lastMessageTime: chat.messages && chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1].createdAt 
                : chat.createdAt,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
        }));

        return res.status(200).json(formattedChats)
    } catch (error) {
        console.error("Error in getMentorChats:", error);
        return res.status(500).json({message:`gettingmentor chats error ${error.message || error}`})
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

        // Format the response
        const formattedChat = {
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            status: chat.status,
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

        // Format the response
        const formattedChat = {
            _id: chat._id,
            mentor: chat.mentor,
            student: chat.student,
            studentName: chat.student?.fullName || "Unknown",
            mentorName: chat.mentor?.fullName || "Unknown",
            studentIsOnline: chat.student?.isOnline || false,
            mentorIsOnline: chat.mentor?.isOnline || false,
            questionTitle: chat.question?.title || "Untitled Question",
            status: chat.status,
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
            return res.statsus(400).json({message:"chat not found"})
        }
        const message=chat.messages.push({sender:req.userId,senderRole:newMessage.sender,content:newMessage.text})
        await chat.save()
        await chat.populate('mentor')
        await chat.populate('student')
        if(newMessage.sender=='mentor'){
            const io=req.app.get('io')
            if(io){
                const socketId=chat.student.socketId
                if(socketId){
                    io.to(socketId).emit('send-message',{chatId:chat._id,studentId:chat.student._id,messages:chat.messages||[]})
                }
            }
            // Mark student's unread messages as read and notify mentor
            const unreadMessageIds = chat.messages
                .filter(msg => msg.senderRole === 'mentor' && !msg.isRead)
                .map(msg => msg._id.toString());
            
            if (unreadMessageIds.length > 0) {
                chat.messages.forEach(msg => {
                    if (unreadMessageIds.includes(msg._id.toString())) {
                        msg.isRead = true;
                    }
                });
                await chat.save();
                const io = req.app.get('io');
                if (io) {
                    io.emit('messages-read', { chatId: chat._id, messageIds: unreadMessageIds });
                }
            }
        }
        if(newMessage.sender=='student'){
            const io=req.app.get('io')
            if(io){
                const socketId=chat.mentor.socketId
                if(socketId){
                    io.to(socketId).emit('send-message',{chatId:chat._id,mentorId:chat.mentor._id,messages:chat.messages||[]})
                }
            }
            // Mark mentor's unread messages as read and notify student
            const unreadMessageIds = chat.messages
                .filter(msg => msg.senderRole === 'student' && !msg.isRead)
                .map(msg => msg._id.toString());
            
            if (unreadMessageIds.length > 0) {
                chat.messages.forEach(msg => {
                    if (unreadMessageIds.includes(msg._id.toString())) {
                        msg.isRead = true;
                    }
                });
                await chat.save();
                const io = req.app.get('io');
                if (io) {
                    io.emit('messages-read', { chatId: chat._id, messageIds: unreadMessageIds });
                }
            }
        }

        
        const msg={sender:req.userId,senderRole:newMessage.sender,content:newMessage.text,createdAt:new Date(Date.now())}
        return res.status(200).json(msg)
    } catch (error) {
         console.error("Error in getChatByQuestionId:", error);
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

        // Mark specified messages as read
        chat.messages.forEach(msg => {
            if (messageIds.includes(msg._id.toString())) {
                msg.isRead = true;
            }
        });

        await chat.save();

        // Emit socket event to notify the sender
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

module.exports={getMentorChats,getStudentChats,getChatById,getChatByQuestionId,createChat,markMessagesAsRead}