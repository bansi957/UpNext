import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';
import ChatMessage from '../components/ChatMessage';
import {
  Send,
  Search,
  MoreVertical,
  Paperclip,
  ArrowLeft,
  MessageCircle,
  Star,
  X,
  File as FileIcon,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveChat } from '../Redux/chatSlice';
import { getSocket } from '../../socket';

function UserMessages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeChat = useSelector((state) => state.chat?.activeChat);
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [chatTab, setChatTab] = useState('active');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { userData } = useSelector((state) => state.user);

  // Fetch active chats with mentors
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/chats/get-student-chats`, {
          withCredentials: true,
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

  // Socket listeners for chat updates
  useEffect(() => {
    if (!userData?._id || !activeChat?._id) return;

    const socket = getSocket();

    socket.on('send-message', ({ messages, studentId, mentorId, chatId, studentUnreadCount }) => {
      // Update messages when mentor OR student sends a message
      if (chatId == activeChat?._id) {
        setCurrentMessages(messages);
      }

      // Update chat list - always update unread count
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: messages[messages.length - 1].content || '',
                lastMessageTime: new Date(),
                unreadCount: studentUnreadCount || 0
              }
            : chat
        )
      );
    });

    socket.on('isOnline', ({ userId }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.mentor?._id === userId ? { ...chat, mentorIsOnline: true } : chat
        )
      );

      if (activeChat?.mentor?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, mentorIsOnline: true }));
      }
    });

    socket.on('isOffline', ({ userId }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat.mentor?._id === userId ? { ...chat, mentorIsOnline: false } : chat
        )
      );

      if (activeChat?.mentor?._id === userId) {
        dispatch(setActiveChat({ ...activeChat, mentorIsOnline: false }));
      }
    });

    socket.on('chat-completed', ({ chatId }) => {
      if (activeChat?._id === chatId) {
        setShowRatingPrompt(true);
        dispatch(
          setActiveChat((prev) =>
            prev?._id === chatId ? { ...prev, status: 'completed' } : prev
          )
        );
      }

      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, status: 'completed' } : chat
        )
      );
    });

    socket.on('rating-received', ({ chatId, rating }) => {
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId ? { ...chat, rating: rating } : chat
        )
      );

      if (activeChat?._id === chatId) {
        setShowRatingPrompt(false);
        setHasRated(true);
        setRating(rating);
        dispatch(setActiveChat({ ...activeChat, rating: rating }));
      }
    });

    return () => {
      socket.off('send-message');
      socket.off('isOnline');
      socket.off('isOffline');
      socket.off('chat-completed');
      socket.off('rating-received');
    };
  }, [userData?._id, activeChat?._id, serverUrl, allChats]);

  // Fetch messages for active chat - DO NOT mark as read
  useEffect(() => {
    if (activeChat?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(
            `${serverUrl}/api/chats/${activeChat._id}`,
            { withCredentials: true }
          );
          setCurrentMessages(res.data.messages || []);

          if (activeChat?.rating) {
            setRating(activeChat.rating);
            setHasRated(true);
          } else {
            setRating(0);
            setHasRated(false);
          }
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };

      fetchMessages();
    }
  }, [activeChat?._id, serverUrl]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Search chats
  useEffect(() => {
    if (!allChats || allChats.length === 0) {
      setFilteredChats([]);
      return;
    }

    let filtered = allChats.filter((chat) =>
      chat?.mentorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat?.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (chatTab === 'active') {
      filtered = filtered.filter(
        (chat) =>
          chat?.status !== 'completed' ||
          (chat?.status === 'completed' && !chat?.rating)
      );
    } else {
      filtered = filtered.filter(
        (chat) => chat?.status === 'completed' && chat?.rating
      );
    }

    setFilteredChats(filtered);
  }, [searchQuery, allChats, chatTab]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedFile) return;
    if (!activeChat?._id) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('sender', 'student');
      formData.append('text', messageInput);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await axios.post(
        `${serverUrl}/api/chats/send-message/${activeChat._id}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setCurrentMessages([...currentMessages, res.data]);
      setMessageInput('');
      handleRemoveFile();

      const schats = allChats.filter((c) => c._id !== activeChat._id);
      setAllChats([activeChat, ...schats]);
      setAllChats((prev) =>
        prev.map((chat) =>
          chat._id === activeChat._id
            ? {
                ...chat,
                lastMessage: messageInput || '📎 File sent',
                lastMessageTime: new Date(),
              }
            : chat
        )
      );
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
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview({
            type: 'image',
            url: e.target.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({
          type: 'file',
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB',
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
    if (window.innerWidth < 768) {
      setIsMobileView(true);
    }
  };

  const handleBackToChats = () => {
    setIsMobileView(false);
  };

  const handleRateMentor = async (stars) => {
    if (!activeChat?._id) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/chats/rate/${activeChat._id}`,
        { rating: stars },
        { withCredentials: true }
      );

      if (res.data.rating) {
        setRating(stars);
        setHasRated(true);
        setShowRatingPrompt(false);

        dispatch(setActiveChat({ ...activeChat, rating: stars }));

        setAllChats((prev) =>
          prev.map((chat) =>
            chat._id === activeChat._id ? { ...chat, rating: stars } : chat
          )
        );
      }
    } catch (err) {
      console.error('Error rating mentor:', err);
    }
  };

  const showRating =
    (activeChat?.status === 'completed' &&
      !hasRated &&
      !activeChat?.rating) ||
    showRatingPrompt;

  const activeChatCount = allChats?.filter(
    (c) =>
      c?.status !== 'completed' ||
      (c?.status === 'completed' && !c?.rating)
  ).length || 0;

  const completedChatCount = allChats?.filter(
    (c) => c?.status === 'completed' && c?.rating
  ).length || 0;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-10 px-4">

        <div className="max-w-7xl my-5 mx-auto">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-purple-500/40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
        <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]">
          <div className="flex gap-4 h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-purple-500/20 bg-slate-800/40">
            {/* Left Sidebar - Chats List */}
            {!isMobileView && (
              <div className="w-full md:w-96 border-r border-slate-700/50 flex flex-col">
                <div className="p-4 border-b border-slate-700/50">
                  <h2 className="text-2xl font-bold text-white mb-4">Messages</h2>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search mentors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                  </div>

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

                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-slate-400">
                      Loading chats...
                    </div>
                  ) : !filteredChats || filteredChats.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      {chatTab === 'active' ? 'No active chats' : 'No completed chats'}
                    </div>
                  ) : (
                    filteredChats.map((chat) =>
                      chat && chat._id ? (
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
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                                  chat?.status === 'completed' && chat?.rating
                                    ? 'bg-emerald-600/60'
                                    : chat?.status === 'completed' &&
                                      !chat?.rating
                                    ? 'bg-orange-600/60'
                                    : 'bg-linear-to-br from-purple-500 to-pink-500'
                                }`}
                              >
                                {chat?.status === 'completed' && chat?.rating
                                  ? '✓'
                                  : chat?.status === 'completed' &&
                                    !chat?.rating
                                  ? '⭐'
                                  : chat?.mentorName?.charAt(0).toUpperCase()}
                              </div>
                              {chat?.mentorIsOnline &&
                                chat?.status !== 'completed' && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white text-sm">
                                {chat?.mentorName || 'Unknown'}
                              </p>
                              <p
                                className={`text-xs truncate ${
                                  chat?.status === 'completed' && chat?.rating
                                    ? 'text-emerald-400'
                                    : chat?.status === 'completed' &&
                                      !chat?.rating
                                    ? 'text-orange-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {chat?.status === 'completed' &&
                                !chat?.rating
                                  ? 'Please rate this mentor'
                                  : chat?.lastMessage || 'No messages yet'}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {chat?.unreadCount > 0 && chat?.status !== 'completed' && (
                                <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                  {chat.unreadCount}
                                </span>
                              )}
                              {chat?.status === 'completed' &&
                                chat?.rating && (
                                  <span className="text-xs font-semibold text-emerald-400">
                                    Done
                                  </span>
                                )}
                              {chat?.status === 'completed' &&
                                !chat?.rating && (
                                  <span className="text-xs font-semibold text-orange-400">
                                    Rate
                                  </span>
                                )}
                              {chat?.rating && (
                                <span className="text-xs text-yellow-400 font-semibold">
                                  {chat.rating}★
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ) : null
                    )
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
                      {activeChat.mentorIsOnline &&
                        activeChat.status !== 'completed' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {activeChat.mentorName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activeChat.status === 'completed'
                          ? 'Chat completed'
                          : activeChat.mentorIsOnline
                          ? 'Active now'
                          : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">Question</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {activeChat.questionTitle || 'Loading...'}
                    </p>
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

                {/* Input or Rating Section */}
                {showRating ? (
                  <div className="p-6 border-t border-orange-600/20 bg-gradient-to-r from-orange-600/5 to-orange-600/5">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-orange-100 font-semibold mb-1">
                          {showRatingPrompt
                            ? 'Mentor closed the chat'
                            : 'Problem solved?'}
                        </p>
                        <p className="text-xs text-orange-400/80">
                          Please rate your mentor
                        </p>
                      </div>

                      <div className="flex justify-center gap-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateMentor(star)}
                            className={`${
                              star <= rating
                                ? 'text-yellow-400'
                                : 'text-slate-400'
                            } hover:text-yellow-300 transition-colors`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>

                      {rating > 0 && (
                        <p className="text-xs text-orange-300">
                          Rated {rating} star{rating !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                ) : activeChat?.status === 'completed' &&
                  activeChat?.rating ? (
                  <div className="p-6 border-t border-emerald-600/20 bg-gradient-to-r from-emerald-600/5 to-emerald-600/5">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                          <span className="text-sm text-emerald-400">✓</span>
                        </div>
                      </div>
                      <p className="text-emerald-100 text-sm font-semibold">
                        Chat completed
                      </p>
                      {activeChat.rating ? (
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= activeChat.rating
                                  ? 'text-yellow-400 text-sm'
                                  : 'text-slate-600 text-sm'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400/80">
                          Rate your mentor
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                              <p className="text-sm font-medium text-white truncate">
                                {filePreview.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {filePreview.size}
                              </p>
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

                    <div className="p-4 border-t border-slate-700/50 bg-slate-800/50 flex items-center gap-2">
                      <label className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 cursor-pointer transition" title="Attach file">
                        <Paperclip className="w-5 h-5" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && !uploading && handleSendMessage()
                        }
                        placeholder="Type a message..."
                        disabled={uploading}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={uploading || (!messageInput.trim() && !selectedFile)}
                        className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="font-semibold text-white">
                      {activeChat.mentorName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {activeChat.status === 'completed'
                        ? 'Chat completed'
                        : 'Active'}
                    </p>
                  </div>
                  <button className="p-2">
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {activeChat.mentorName?.charAt(0).toUpperCase()}
                      </div>
                      {activeChat.mentorIsOnline &&
                        activeChat.status !== 'completed' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {activeChat.mentorName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activeChat.status === 'completed'
                          ? 'Chat completed'
                          : activeChat.mentorIsOnline
                          ? 'Active now'
                          : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Question Details */}
                <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-700/50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-1">Question</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {activeChat.questionTitle || 'Loading...'}
                    </p>
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

                {/* Input or Rating Section */}
                {showRating ? (
                  <div className="p-4 border-t border-orange-600/20 bg-gradient-to-r from-orange-600/5 to-orange-600/5">
                    <div className="text-center space-y-3">
                      <div>
                        <p className="text-orange-100 font-semibold mb-1">
                          {showRatingPrompt
                            ? 'Mentor closed the chat'
                            : 'Problem solved?'}
                        </p>
                        <p className="text-xs text-orange-400/80">
                          Please rate your mentor
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateMentor(star)}
                            className={`${
                              star <= rating
                                ? 'text-yellow-400'
                                : 'text-slate-400'
                            } hover:text-yellow-300 transition-colors`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>

                      {rating > 0 && (
                        <p className="text-xs text-orange-300">
                          Rated {rating}★
                        </p>
                      )}
                    </div>
                  </div>
                ) : activeChat?.status === 'completed' && activeChat?.rating ? (
                  <div className="p-4 border-t border-emerald-600/20 bg-gradient-to-r from-emerald-600/5 to-emerald-600/5">
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                          <span className="text-sm text-emerald-400">✓</span>
                        </div>
                      </div>
                      <p className="text-emerald-100 text-sm font-semibold">
                        Chat completed
                      </p>
                      {activeChat.rating ? (
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= activeChat.rating
                                  ? 'text-yellow-400 text-sm'
                                  : 'text-slate-600 text-sm'
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-400/80">
                          Rate your mentor
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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
                              <p className="text-sm font-medium text-white truncate">
                                {filePreview.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                {filePreview.size}
                              </p>
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

                    <div className="border-t border-slate-700/50 bg-slate-800/50 p-4 flex items-center gap-2">
                      <label className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 cursor-pointer transition">
                        <Paperclip className="w-5 h-5" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && !uploading && handleSendMessage()
                        }
                        placeholder="Type a message..."
                        disabled={uploading}
                        className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={uploading || (!messageInput.trim() && !selectedFile)}
                        className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserMessages;