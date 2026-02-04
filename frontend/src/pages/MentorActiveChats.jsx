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

function MentorActiveChats() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const activeChat = useSelector((state) => state.chat?.activeChat);
  const messages = useSelector((state) => state.chat?.messages || []);
  const chats = useSelector((state) => state.chat?.chats || []);
  
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
        const res = await axios.get(`${serverUrl}/api/chats/active`, {
          withCredentials: true
        });
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
            `${serverUrl}/api/chats/${activeChat._id}/messages`,
            { withCredentials: true }
          );
          setCurrentMessages(res.data || []);
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
      await axios.post(
        `${serverUrl}/api/chats/${activeChat._id}/messages`,
        { text: messageInput },
        { withCredentials: true }
      );

      setCurrentMessages([...currentMessages, newMessage]);
      dispatch(addMessage(newMessage));
      setMessageInput('');

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
    setIsMobileView(true);
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
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full p-4 border-b border-slate-700/30 text-left transition-all ${
                          activeChat?._id === chat._id
                            ? 'bg-purple-600/20 border-l-4 border-l-purple-600'
                            : 'hover:bg-slate-700/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {chat.studentName?.charAt(0).toUpperCase()}
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
            {activeChat ? (
              <div className="hidden md:flex flex-1 flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {activeChat.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{activeChat.studentName}</p>
                      <p className="text-xs text-slate-400">Active now</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Info className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
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
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400">
                      <Smile className="w-5 h-5" />
                    </button>
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
                      placeholder="Message..."
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
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
