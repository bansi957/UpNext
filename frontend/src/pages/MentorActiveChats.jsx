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
  Paperclip,
  Smile,
  ArrowLeft,
  X,
  File as FileIcon,
  MessageCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setActiveChat, markMessagesAsRead } from '../Redux/chatSlice';
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
  const [chatTab, setChatTab] = useState('active'); // 'active' or 'completed'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Fetch messages for active chat and mark as read
  useEffect(() => {
    if (activeChat?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `${serverUrl}/api/chats/${activeChat._id}`,
            { withCredentials: true }
          );
          setCurrentMessages(res.data.messages || []);

          // Update activeChat with questionTitle from response
          if (res.data.questionTitle) {
            dispatch(setActiveChat({ ...activeChat, questionTitle: res.data.questionTitle, questionId: res.data.questionId }));
          }

          // Mark messages as read for this chat
          await axios.post(
            `${serverUrl}/api/chats/mark-as-read/${activeChat._id}`,
            {},
            { withCredentials: true }
          );

          // Update Redux state to mark messages as read
          dispatch(markMessagesAsRead(activeChat._id));
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };

      fetchMessages();
    }
  }, [activeChat?._id, dispatch]);

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

  // Search and filter chats by status
  useEffect(() => {
    let filtered = allChats.filter((chat) =>
      chat.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by tab
    if (chatTab === 'active') {
      filtered = filtered.filter(chat => chat.status !== 'completed');
    } else {
      filtered = filtered.filter(chat => chat.status === 'completed');
    }

    setFilteredChats(filtered);
  }, [searchQuery, allChats, chatTab]);

  // Calculate chat counts
  const activeChatCount = allChats.filter(c => c.status !== 'completed').length;
  const completedChatCount = allChats.filter(c => c.status === 'completed').length;

  // Handle send message with file support
  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedFile) return;
    if (!activeChat?._id) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('sender', 'mentor');
      formData.append('text', messageInput);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await axios.post(
        `${serverUrl}/api/chats/send-message/${activeChat._id}`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setCurrentMessages([...currentMessages, res.data]);
      dispatch(addMessage(res.data));
      setMessageInput('');
      handleRemoveFile();
      
      const schats = allChats.filter(c => c._id !== activeChat._id);
      setAllChats([activeChat, ...schats]);
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === activeChat._id
            ? { ...chat, lastMessage: messageInput || '📎 File sent', lastMessageTime: new Date() }
            : chat
        )
      );

      // Emit socket event to update navbar unread counts in real-time
      const socket = getSocket();
      socket.emit('message-replied', { 
        chatId: activeChat._id,
        sender: 'mentor',
        studentId: activeChat.student?._id 
      });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview based on file type
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview({
            type: 'image',
            url: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({
          type: 'file',
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB'
        });
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

  // Auto-show mobile chat view when activeChat is set on mobile (e.g., when coming from ViewQuestion)
  useEffect(() => {
    if (activeChat && window.innerWidth < 768) {
      setIsMobileView(true);
    }
  }, [activeChat]);

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

  // Socket listeners for chat updates
  useEffect(() => {
    if (!userData?._id || !activeChat?._id) return;

    const socket = getSocket();

    socket.on('send-message', ({ messages, mentorId, studentId, chatId, mentorUnreadCount }) => {
      // Update messages when EITHER mentor OR student sends a message
      if (chatId == activeChat?._id) {
        setCurrentMessages(messages);
      }

      // Update chat list - move chat to top
      if (mentorId == userData?._id || studentId == userData?._id) {
        const fchats = allChats.find((c) => c._id == chatId);
        const schats = allChats.filter((c) => c._id !== chatId);
        if (fchats) {
          setAllChats([fchats, ...schats]);
        }
      }

      // Update last message and unread count in chat list
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: messages[messages.length - 1].content || '',
                lastMessageTime: new Date(),
                unreadCount: mentorUnreadCount || 0
              }
            : chat
        )
      );
    });

    socket.on('isOnline', ({ userId }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.student?._id === userId ? { ...chat, studentIsOnline: true } : chat
        )
      );

      if (activeChat?.student?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, studentIsOnline: true }));
      }
    });

    socket.on('isOffline', ({ userId }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.student?._id === userId ? { ...chat, studentIsOnline: false } : chat
        )
      );

      if (activeChat?.student?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, studentIsOnline: false }));
      }
    });

    socket.on('chat-completed', ({ chatId }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, status: 'completed', studentIsOnline: false }
            : chat
        )
      );

      if (activeChat?._id === chatId) {
        dispatch(setActiveChat({ ...activeChat, status: 'completed', studentIsOnline: false }));
      }
    });

    return () => {
      socket.off('send-message');
      socket.off('isOnline');
      socket.off('isOffline');
      socket.off('chat-completed');
    };
  }, [userData?._id, activeChat?._id, serverUrl, allChats, dispatch]);

  // ...existing code...
  useEffect(() => {
    if (window.innerWidth < 768) {
      // If activeChat is already set (e.g., coming from ViewQuestion), show mobile chat view
      // Otherwise, show chat list first
      if (activeChat) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    }
  }, [activeChat])

const handleCompleteChat = async () => {
  if (!activeChat?._id) return

  try {
    const res = await axios.post(
      `${serverUrl}/api/chats/complete/${activeChat._id}`,
      {},
      { withCredentials: true }
    )

    // Update active chat with completed status
    dispatch(setActiveChat({ ...activeChat, status: 'completed' }))

    // Update chat list
    setAllChats(prev =>
      prev.map(chat =>
        chat._id === activeChat._id 
          ? { ...chat, status: 'completed', lastMessage: '✓ Chat completed' }
          : chat
      )
    )
  } catch (err) {
    console.error('Failed to complete chat', err)
  }
}


  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-10 px-4">
        <div className="max-w-7xl my-5 mx-auto">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-purple-500/40 ${isMobileView && activeChat ? 'hidden' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">
          <div className="flex gap-4 h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-purple-500/20 bg-slate-800/40">

            {/* Left Sidebar - Chats List */}
            {(!isMobileView) && (
              <div className="w-full md:w-96 border-r border-slate-700/50 flex flex-col">
                
                {/* Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>
                
                  {/* Tab Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChatTab('active')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        chatTab === 'active'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Active ({activeChatCount})
                    </button>
                    <button
                      onClick={() => setChatTab('completed')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        chatTab === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      Completed ({completedChatCount})
                    </button>
                  </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-slate-400">Loading chats...</div>
                  ) : filteredChats.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      {chatTab === 'active' ? 'No active chats' : 'No completed chats'}
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
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                              chat.status === 'completed'
                                ? 'bg-emerald-600/60'
                                : 'bg-linear-to-br from-purple-500 to-pink-500'
                            }`}>
                              {chat.status === 'completed' ? '✓' : chat.studentName?.charAt(0).toUpperCase()}
                            </div>
                            {chat.studentIsOnline && chat.status !== 'completed' && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm">{chat.studentName}</p>
                            <p className={`text-xs truncate ${
                              chat.status === 'completed'
                                ? 'text-emerald-400'
                                : 'text-slate-400'
                            }`}>
                              {chat.lastMessage}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {chat?.unreadCount > 0 && chat?.status !== 'completed' && (
                              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                {chat.unreadCount}
                              </span>
                            )}
                            {chat.status === 'completed' && (
                              <span className="text-xs font-semibold text-emerald-400">Done</span>
                            )}
                            {chat.rating && (
                              <span className="text-xs text-yellow-400 font-semibold">{chat.rating}★</span>
                            )}
                          </div>
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        activeChat.status === 'completed'
                          ? 'bg-emerald-600/60'
                          : 'bg-linear-to-br from-purple-500 to-pink-500'
                      }`}>
                        {activeChat.status === 'completed' ? '✓' : activeChat.studentName?.charAt(0).toUpperCase()}
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
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-lg hover:shadow-emerald-500/50"
                    >
                      Complete Chat
                    </button>
                  )}
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">Question</p>
                    <p className="text-sm font-semibold text-white truncate">{activeChat.questionTitle || 'Loading...'}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/question/${activeChat.questionId}`)}
                    className="ml-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all whitespace-nowrap"
                  >
                    View
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} chatId={activeChat?._id} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input or Completion Message */}
                {activeChat?.status === 'completed' ? (
                  <div className="p-6 border-t border-emerald-600/30 bg-emerald-600/10 rounded-b-2xl">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center">
                          <span className="text-2xl text-emerald-400">✓</span>
                        </div>
                      </div>
                      <p className="text-emerald-100 font-semibold">You've completed the problem</p>
                      <p className="text-xs text-emerald-400/80">Your guidance and support have been invaluable to the student. Well done!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
                    {/* File Preview */}
                    {filePreview && (
                      <div className="p-4 bg-slate-900/50 border-b border-slate-700/50">
                        {filePreview.type === 'image' ? (
                          <div className="relative inline-block">
                            <img
                              src={filePreview.url}
                              alt="Preview"
                              className="max-h-48 rounded-lg border border-slate-600"
                            />
                            <button
                              onClick={handleRemoveFile}
                              className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-700 transition"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <FileIcon className="w-5 h-5 text-purple-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{filePreview.name}</p>
                              <p className="text-xs text-slate-400">{filePreview.size}</p>
                            </div>
                            <button
                              onClick={handleRemoveFile}
                              className="p-1 hover:bg-slate-700/50 rounded transition"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Input */}
                    <div className="flex items-end gap-3">
                      <label className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 cursor-pointer transition flex-shrink-0" title="Attach file">
                        <Paperclip className="w-5 h-5" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey) && !uploading) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message... (Shift+Enter to send)"
                        disabled={uploading}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 min-w-0 resize-none max-h-32 overflow-y-auto"
                        rows="1"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={uploading || (!messageInput.trim() && !selectedFile)}
                        className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
                    <p className="text-xs text-slate-400">
                      {activeChat.status === 'completed' ? 'Chat completed' : 'Active'}
                    </p>
                  </div>
                  {activeChat?.status !== 'completed' && (
                    <button
                      onClick={handleCompleteChat}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                    >
                      Complete
                    </button>
                  )}
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">Question</p>
                    <p className="text-sm font-semibold text-white truncate">{activeChat.questionTitle || 'Loading...'}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/question/${activeChat.questionId}`)}
                    className="ml-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-all whitespace-nowrap"
                  >
                    View
                  </button>
                </div>

                {/* Mobile Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} chatId={activeChat?._id} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Mobile Input or Completion Message */}
                {activeChat?.status === 'completed' ? (
                  <div className="p-4 border-t border-emerald-600/30 bg-emerald-600/10">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/30 flex items-center justify-center">
                          <span className="text-xl text-emerald-400">✓</span>
                        </div>
                      </div>
                      <p className="text-emerald-100 text-sm font-semibold">You've completed the problem</p>
                      <p className="text-xs text-emerald-400/80">Your guidance helps the student succeed!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* File Preview for Mobile - Moved outside to be more visible */}
                    {filePreview && (
                      <div className="border-t border-slate-700/50 bg-slate-900/80 p-4">
                        {filePreview.type === 'image' ? (
                          <div className="relative inline-block w-full">
                            <img
                              src={filePreview.url}
                              alt="Preview"
                              className="w-full max-h-48 rounded-lg border border-slate-600 object-cover"
                            />
                            <button
                              onClick={handleRemoveFile}
                              className="absolute -top-3 -right-3 p-1 bg-red-600 rounded-full hover:bg-red-700 transition"
                            >
                              <X className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-slate-800/70 rounded-lg border border-slate-700/50">
                            <FileIcon className="w-6 h-6 text-purple-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{filePreview.name}</p>
                              <p className="text-xs text-slate-400">{filePreview.size}</p>
                            </div>
                            <button
                              onClick={handleRemoveFile}
                              className="p-1 hover:bg-slate-600 rounded transition"
                            >
                              <X className="w-5 h-5 text-slate-300" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mobile Input */}
                    <div className="border-t border-slate-700/50 bg-slate-800/50 p-4 flex items-end gap-1 flex-nowrap">
                      <label className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 cursor-pointer transition flex-shrink-0 flex-grow-0" title="Attach file">
                        <Paperclip className="w-5 h-5" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey) && !uploading) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message... (Shift+Enter to send)"
                        disabled={uploading}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 min-w-0 resize-none max-h-32 overflow-y-auto"
                        rows="1"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={uploading || (!messageInput.trim() && !selectedFile)}
                        className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex-grow-0"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MentorActiveChats;
