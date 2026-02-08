const User=require("./models/user_model")
const Chat = require("./models/chat_model")

const socketHandler=(io)=>{
    io.on("connection",(socket)=>{
        socket.on("identity",async ({userId})=>{
            try {
                console.log(socket)
                const user=await User.findByIdAndUpdate(userId,{socketId:socket.id,isOnline:true},{new:true})

            } catch (error) {
                console.log(error)
            }
        })

        socket.on("disconnect",async ()=>{
            try {
                const user=await User.findOneAndUpdate({socketId:socket.id},{socketId:null,isOnline:false},{new:true})

            } catch (error) {
                console.log(error)
            }
        })

        // Mark message as read
        socket.on("mark-message-read", async ({chatId, messageIds}) => {
            try {
                const chat = await Chat.findById(chatId);
                if (chat) {
                    // Mark specified messages as read
                    chat.messages.forEach(msg => {
                        if (messageIds.includes(msg._id.toString())) {
                            msg.isRead = true;
                        }
                    });
                    await chat.save();

                    // Emit event to notify the sender
                    io.emit('messages-read', { chatId: chat._id, messageIds });
                }
            } catch (error) {
                console.log("Error marking message as read:", error);
            }
        });
    })
}

module.exports={socketHandler}