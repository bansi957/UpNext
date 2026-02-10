import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';
import ChatMessage from '../components/ChatMessage';
import {
  Send,
  Search,
  Bell,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChat } from '../Redux/chatSlice';
import { getSocket } from '../../socket';
import { setActiveChats } from '../Redux/userSlice';

function UserMessages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const activeChat = useSelector((state) => state.chat?.activeChat);

  // Local state
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);
  const {userData}=useSelector(state=>state.user)
  // Fetch active chats with mentors
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chats/get-student-chats`, {
          withCredentials: true
        });
const sortedChats = [...res.data].sort(
  (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
);
        setAllChats(sortedChats || []);
        setFilteredChats(sortedChats || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for active chat
useEffect(()=>{
  if(!userData?._id) return;

  const socket=getSocket()

  socket.on('send-message',({messages,studentId,chatId})=>{
    if(studentId==userData._id && chatId==activeChat?._id){
      setCurrentMessages(messages)
     

      // Mark mentor's unread messages as read
      const mentorMessageIds = messages
        ?.filter(msg => msg.senderRole === 'mentor' && !msg.isRead)
        .map(msg => msg._id) || [];

      if (mentorMessageIds.length > 0) {
        axios.post(
          `${serverUrl}/api/chats/mark-read/${chatId}`,
          { messageIds: mentorMessageIds },
          { withCredentials: true }
        ).catch(err => console.error('Error marking messages as read:', err));
      }
    }

     if(studentId==userData?._id){
        const fchats=allChats.find(c=>c._id==chatId)
         const schats=allChats.filter(c=>c._id!==chatId)
      setAllChats([fchats,...schats])
       setAllChats((prev) =>
        prev.map((chat) =>
          chat._id == chatId
            ? { ...chat, lastMessage:messages[messages.length-1].content||"bansi", lastMessageTime: new Date() }
            : chat
        )
      );

      }

  })

socket.on('isOnline', ({ userId }) => {
  setAllChats(prev =>
    prev.map(chat =>
      chat.mentor?._id === userId
        ? { ...chat, mentorIsOnline: true }
        : chat
    )
  )

  // also update activeChat if open
  if (activeChat?.mentor?._id === userId) {
    dispatch(setActiveChat({ ...activeChat, mentorIsOnline: true }))
  }
})


socket.on('isOffline', ({ userId }) => {
  setAllChats(prev =>
    prev.map(chat =>
      chat.mentor?._id === userId
        ? { ...chat, mentorIsOnline: false }
        : chat
    )
  )

  // also update activeChat if open
  if (activeChat?.mentor?._id === userId) {
    dispatch(setActiveChat({ ...activeChat, mentorIsOnline: false }))
  }
})



socket.on('chat-completed', ({ chatId }) => {
  setAllChats(prev =>
    prev.map(chat =>
      chat._id === chatId
        ? { ...chat, status: 'completed' }
        : chat
    )
  )

  if (activeChat?._id === chatId) {
dispatch(setActiveChat(prev =>
  prev?._id === chatId
    ? { ...prev, status: 'completed' }
    : prev
))
  }
})


  // socket.on('messages-read',({chatId, messageIds})=>{
  //   if(chatId==activeChat?._id){
  //     setCurrentMessages(prev => 
  //       prev.map(msg => 
  //         messageIds.includes(msg._id) || messageIds.includes(msg?._id.toString()) ? {...msg, isRead: true} : msg
  //       )
  //     )
  //   }
  // })

  return ()=>{
    socket.off('send-message')
    socket.off('isOnline')
    socket.off('isOffine')
    socket.off('chat-completed')

  }
},[userData?._id,activeChat,serverUrl])

  useEffect(() => {
    if (activeChat?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `${serverUrl}/api/chats/${activeChat._id}`,
            { withCredentials: true }
          );
          setCurrentMessages(res.data.messages || []);

          // Mark all mentor's messages as read
          const mentorMessageIds = res.data.messages
            ?.filter(msg => msg.senderRole === 'mentor' && !msg.isRead)
            .map(msg => msg._id) || [];

          if (mentorMessageIds.length > 0) {
            axios.post(
              `${serverUrl}/api/chats/mark-read/${activeChat._id}`,
              { messageIds: mentorMessageIds },
              { withCredentials: true }
            ).catch(err => console.error('Error marking messages as read:', err));
          }
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };

      fetchMessages();
    }
  }, [activeChat]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Search chats
  useEffect(() => {
    const filtered = allChats.filter((chat) =>
      chat.mentorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery, allChats]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat?._id) return;

    const newMessage = {
      sender: 'student',
      text: messageInput,
      timestamp: new Date()
    };

    try {
      const res=await axios.post(
        `${serverUrl}/api/chats/send-message/${activeChat._id}`,
        newMessage,
        { withCredentials: true }
      );

      setCurrentMessages([...currentMessages,res.data]);
      setMessageInput('');
      const schats=allChats.filter(c=>c._id!==activeChat._id)
      setAllChats([activeChat,...schats])
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === activeChat._id
            ? { ...chat, lastMessage: messageInput, lastMessageTime: new Date() }
            : chat
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    // Only set mobile view if on actual mobile device
    if (window.innerWidth < 768) {
      setIsMobileView(true);
    }
  };

  const handleBackToChats = () => {
    setIsMobileView(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
const showRating =
  activeChat?.status === 'completed'

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
          <div className="flex gap-4 h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-purple-500/20 bg-slate-800/40">

            {/* Left Sidebar - Chats List */}
            {!isMobileView && (
              <div className="w-full md:w-96 border-r border-slate-700/50 flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">Messages</h2>
                    {/* <Bell className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" /> */}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-slate-400">Loading chats...</div>
                  ) : filteredChats.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full p-4 border-b border-slate-700/30 text-left transition-all ${
                          activeChat?._id === chat._id
                            ? 'bg-purple-600/20 border-l-4 border-l-purple-600'
                            : 'hover:bg-slate-700/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {chat.mentorName?.charAt(0).toUpperCase()}
                            </div>
                            {chat.mentorIsOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm">{chat.mentorName}</p>
                            <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                          </div>
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Right Side - Chat Window */}
            {activeChat ? (
              <div className="hidden md:flex flex-1 flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {activeChat.mentorName?.charAt(0).toUpperCase()}
                      </div>
                      {activeChat.mentorIsOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{activeChat.mentorName}</p>
                      {activeChat.mentorIsOnline?<p className="text-xs text-slate-400">Active now</p>:<p className="text-xs text-slate-400">Offline</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Question</p>
                  <p className="text-sm font-semibold text-white truncate">{activeChat.questionTitle || 'Loading...'}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* ⭐ RATING SECTION */}
  {showRating ? (
    <div className="text-center">
      <p className="text-sm text-white mb-2">
        Rate your mentor
      </p>

      <div className="flex justify-center gap-2">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            onClick={() => handleRateMentor(star)}
            className="text-yellow-400 text-2xl hover:scale-110 transition"
          >
            ★
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-2">
        This chat has been completed
      </p>
    </div>
  ) : (
    /* 💬 NORMAL INPUT */
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white"
      />

      <button
        onClick={handleSendMessage}
        className="p-2 rounded-lg bg-purple-600 text-white"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )}
              </div>
            ) : (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400">
                <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg">Select a mentor to start chatting</p>
              </div>
            )}

            {/* Mobile Chat View */}
            {isMobileView && activeChat && (
              <div className="w-full flex md:hidden flex-col">
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <button onClick={handleBackToChats} className="p-2">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <p className="font-semibold text-white">{activeChat.mentorName}</p>
                  </div>
                  <button className="p-2">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-1">Question</p>
                  <p className="text-sm font-semibold text-white truncate">{activeChat.questionTitle || 'Loading...'}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
  disabled={activeChat?.status === 'completed'}
  placeholder={
    activeChat?.status === 'completed'
      ? 'Chat completed. Please rate mentor.'
      : 'Type a message...'
  }                   className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div> */}

                <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">

  {/* ⭐ RATING SECTION */}
  {showRating ? (
    <div className="text-center">
      <p className="text-sm text-white mb-2">
        Rate your mentor
      </p>

      <div className="flex justify-center gap-2">
        {[1,2,3,4,5].map(star => (
          <button
            key={star}
            onClick={() => handleRateMentor(star)}
            className="text-yellow-400 text-2xl hover:scale-110 transition"
          >
            ★
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-2">
        This chat has been completed
      </p>
    </div>
  ) : (
    /* 💬 NORMAL INPUT */
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white"
      />

      <button
        onClick={handleSendMessage}
        className="p-2 rounded-lg bg-purple-600 text-white"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )}
</div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserMessages;