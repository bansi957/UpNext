import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';
import ChatMessage from '../components/ChatMessage';
import {
  Send,
  Search,
  Phone,
  Video,
  Info,
  MoreVertical,
  Paperclip,
  Smile,
  ArrowLeft
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setActiveChat } from '../Redux/chatSlice';
import { getSocket } from '../../socket';

function MentorActiveChats() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const activeChat = useSelector((state) => state.chat?.activeChat);
  const messages = useSelector((state) => state.chat?.messages || []);
  const chats = useSelector((state) => state.chat?.chats || []);
  const {userData}=useSelector(state=>state.user)
  // Local state
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch active chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chats/get-mentor-chats`, {
          withCredentials: true
        });
        console.log(res.data)
        setAllChats(res.data || []);
        setFilteredChats(res.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages for active chat
  useEffect(() => {
    if (activeChat?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `${serverUrl}/api/chats/${activeChat._id}`,
            { withCredentials: true }
          );
          setCurrentMessages(res.data.messages || []);

          // Mark all student's messages as read
          const studentMessageIds = res.data.messages
            ?.filter(msg => msg.senderRole === 'student' && !msg.isRead)
            .map(msg => msg._id) || [];

          if (studentMessageIds.length > 0) {
            axios.post(
              `${serverUrl}/api/chats/mark-read/${activeChat._id}`,
              { messageIds: studentMessageIds },
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

  // Detect mobile view on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search chats
  useEffect(() => {
    const filtered = allChats.filter((chat) =>
      chat.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [searchQuery, allChats]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat?._id) return;

    const newMessage = {
      sender: 'mentor',
      text: messageInput,
      timestamp: new Date()
    };

    try {
      const res=await axios.post(
        `${serverUrl}/api/chats/send-message/${activeChat._id}`,
        newMessage,
        { withCredentials: true }
      );
      console.log(res)
      setCurrentMessages([...currentMessages,res.data]);
      console.log(currentMessages)
      dispatch(addMessage(res.data));
      setMessageInput('');
      const schats=allChats.filter(c=>c._id!==activeChat._id)
      setAllChats([activeChat,...schats])
      // Update last message in chat list
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
    // Only toggle mobile view if on mobile
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(()=>{
    if(!userData?._id) return;
  
    const socket=getSocket()
  
    socket.on('send-message',({messages,mentorId,chatId})=>{
      if(mentorId==userData._id && chatId==activeChat?._id){
        setCurrentMessages(messages)
        
        // Mark student's unread messages as read
        const studentMessageIds = messages
          ?.filter(msg => msg.senderRole === 'student' && !msg.isRead)
          .map(msg => msg._id) || [];

        if (studentMessageIds.length > 0) {
          axios.post(
            `${serverUrl}/api/chats/mark-read/${chatId}`,
            { messageIds: studentMessageIds },
            { withCredentials: true }
          ).catch(err => console.error('Error marking messages as read:', err));
        }
      }

      
     if(mentorId==userData?._id){
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
          chat.student?._id === userId
            ? { ...chat, studentIsOnline: true }
            : chat
        )
      )
    
      // also update activeChat if open
      if (activeChat?.student?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, studentIsOnline: true }))
      }
    })
    socket.on('isOffline', ({ userId }) => {
  setAllChats(prev =>
    prev.map(chat =>
      chat.student?._id === userId
        ? { ...chat, studentIsOnline: false }
        : chat
    )
  )
      if (activeChat?.student?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, studentIsOnline: false }))
      }
})

socket.on('chat-completed', ({ chatId }) => {
  // update left-side chat list
  setAllChats(prev =>
    prev.map(chat =>
      chat._id === chatId
        ? {
            ...chat,
            status: 'completed',
            studentIsOnline: false // 🔥 FORCE OFF
          }
        : chat
    )
  )

  // update right-side active chat
if (activeChat?._id === chatId) {
  dispatch(setActiveChat({
    ...activeChat,
    status: 'completed',
    studentIsOnline: false
  }))
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
      socket.off('isOffline')
      socket.off('chat-completed')
    }
  },[userData?._id,activeChat,serverUrl])

  useEffect(() => {
  if (window.innerWidth < 768) {
    setIsMobileView(false); // always show chat list first
  }
}, [])

const handleCompleteChat = async () => {
  if (!activeChat?._id) return

  try {
    const res = await axios.post(
      `${serverUrl}/api/chats/complete/${activeChat._id}`,
      {},
      { withCredentials: true }
    )

    // update active chat
    // dispatch(setActiveChat(res.data))

    // // update chat list
    // setAllChats(prev =>
    //   prev.map(chat =>
    //     chat._id === res.data._id ? res.data : chat
    //   )
    // )
  } catch (err) {
    console.error('Failed to complete chat', err)
  }
}


  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
          <div className="flex gap-4 h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-purple-500/20 bg-slate-800/40">

            {/* Left Sidebar - Chats List */}
            {(!isMobileView) && (
              <div className="w-full md:w-96 border-r border-slate-700/50 flex flex-col">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search chats..."
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
                    <div className="p-4 text-center text-slate-400">No chats found</div>
                  ) : (
                    filteredChats.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => dispatch(setActiveChat(chat))}
                        className={`w-full p-4 border-b border-slate-700/30 text-left transition-all ${
                          activeChat?._id === chat._id
                            ? 'bg-purple-600/20 border-l-4 border-l-purple-600'
                            : 'hover:bg-slate-700/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {chat.studentName?.charAt(0).toUpperCase()}
                            </div>
                           {chat.studentIsOnline && chat.status !== 'completed' && (
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
)}

                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm">{chat.studentName}</p>
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
            {activeChat && !isMobileView ? (
              <div className="hidden md:flex flex-1 flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {activeChat.studentName?.charAt(0).toUpperCase()}
                      </div>
                      {activeChat.studentIsOnline && activeChat.status !== 'completed' && (
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
)}

                    </div>
                    <div>
                      <p className="font-semibold text-white">{activeChat.studentName}</p>
<p className="text-xs text-slate-400">
  {activeChat.status === 'completed'
    ? 'Chat completed'
    : activeChat.studentIsOnline
      ? 'Active now'
      : 'Offline'}
</p>
                    </div>
                  </div>
     {activeChat?.status !== 'completed' && (
  <button
    onClick={handleCompleteChat}
    className="px-3 py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white"
  >
    Complete
  </button>
)}
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

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
 disabled={activeChat?.status === 'completed'}
  placeholder={
    activeChat?.status === 'completed'
      ? 'Chat completed'
      : 'Type a message...'
  }                      className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    {/* <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Smile className="w-5 h-5" />
                    </button> */}
                    <button
                      onClick={handleSendMessage}
                      className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-400">
                <p className="text-lg">Select a chat to start messaging</p>
              </div>
            )}

            {/* Mobile Chat View */}
            {isMobileView && activeChat && (
              <div className="w-full flex md:hidden flex-col">
                {/* Mobile Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <button onClick={handleBackToChats} className="p-2">
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 text-center">
                    <p className="font-semibold text-white">{activeChat.studentName}</p>
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

                {/* Mobile Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Mobile Input */}
                <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
 disabled={activeChat?.status === 'completed'}
  placeholder={
    activeChat?.status === 'completed'
      ? 'Chat completed'
      : 'Type a message...'
  }                      className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MentorActiveChats;
