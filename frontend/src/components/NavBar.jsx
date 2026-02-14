import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, MessageSquare, Users, HelpCircle, 
  FileText, Award, Settings, Bell, User, ChevronDown,
  BookOpen, LogOut
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import { addUserData } from '../Redux/UserSlice';
import { getSocket } from '../../socket';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileQuickDropdown, setShowMobileQuickDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileQuickRef = useRef(null);
  
  const {userData,requests} = useSelector((state) => state.user);
  const role = userData?.role;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileQuickRef.current && !mobileQuickRef.current.contains(event.target)) {
        setShowMobileQuickDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const {pendingChats}=useSelector(state=>state.chat)
  const [c,setC]=useState(0);
  
  // Recalculate unread count based on pendingChats
  useEffect(() => {
    if (!pendingChats || !Array.isArray(pendingChats)) {
      setC(0);
      return;
    }

    let totalUnread = 0;

    pendingChats.forEach(chat => {
      if (chat?.messages && Array.isArray(chat.messages)) {
        chat.messages.forEach(msg => {
          if (msg.sender !== userData?._id && !msg.isRead) {
            totalUnread += 1;
          }
        });
      }
    });

    setC(totalUnread);

  }, [pendingChats, userData?._id]);



  useEffect(()=>{
    const socket=getSocket()
    
    socket.on('send-message', ({ messages, sender, mentorId, studentId, chatId, mentorUnreadCount, studentUnreadCount }) => {
      // Update unread count based on current user role and backend's unread counts
      if (userData?.role === 'mentor' && mentorUnreadCount !== undefined) {
        // For mentors: use mentorUnreadCount from backend
        setC(mentorUnreadCount);
      } else if (userData?.role === 'student' && studentUnreadCount !== undefined) {
        // For students: use studentUnreadCount from backend
        setC(studentUnreadCount);
      }
    });

    // Listen for when messages are marked as read
    socket.on('messages-read', ({ mentorUnreadCount, studentUnreadCount, readBy }) => {
      if (userData?.role === 'mentor' && mentorUnreadCount !== undefined) {
        setC(mentorUnreadCount);
      } else if (userData?.role === 'student' && studentUnreadCount !== undefined) {
        setC(studentUnreadCount);
      }
    });

    // Listen for when a user replies (for real-time navbar count update)
    socket.on('message-replied', ({ sender, mentorId, studentId }) => {
      // Recalculate unread count from pendingChats when someone replies
      if (!pendingChats || !Array.isArray(pendingChats)) return;
      
      let totalUnread = 0;
      pendingChats.forEach(chat => {
        if (chat?.messages && Array.isArray(chat.messages)) {
          chat.messages.forEach(msg => {
            if (msg.sender !== userData?._id && !msg.isRead) {
              totalUnread += 1;
            }
          });
        }
      });
      setC(totalUnread);
    });

    return()=>{
      socket.off('send-message');
      socket.off('messages-read');
      socket.off('message-replied');
    }
  },[userData?._id, userData?.role, pendingChats])
  const studentNavItems = [
    { name: 'Mentors', path: '/user/mentors', icon: Users },
    { name: 'Ask Question', path: '/user/ask-question', icon: HelpCircle },
    { name: 'My Queries', path: '/user/queries', icon: FileText },
    { name: 'Messages', path: '/user/messages', icon: MessageSquare, badge:c},
  ];

  const [requestslength, setRequestLength] = useState(0);

  useEffect(() => {
    const count = requests?.filter(
      (e) => e.status === "pending"
    ).length || 0;
    setRequestLength(count);
  }, [requests]);

  const mentorNavItems = [
    { name: 'Requests', path: '/mentor/requests', icon: FileText, badge: requestslength },
    { name: 'Active Chats', path: '/mentor/chats', icon: MessageSquare, badge: c },
    { name: 'Guidelines', path: '/mentor/guidelines', icon: BookOpen }
  ];

  const navItems = role === 'mentor' ? mentorNavItems : studentNavItems;
  const isActive = (path) => location.pathname === path;

  const handleLogout = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {withCredentials: true});
      dispatch(addUserData(null));
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };



  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border-b border-purple-500/20' 
          : 'bg-slate-900/60 backdrop-blur-xl border-b border-purple-500/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex flex-col group transition-transform duration-300 hover:scale-105"
            >
              <div className="flex items-baseline relative">
                <span className="text-2xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-linear-x">
                  UpNext
                </span>
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <p className="text-xs text-purple-300/60 font-medium tracking-wider ml-0.5 mt-0.5">
                From Campus to Career
              </p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {(() => {
                const profileComplete = (userData?.profileCompletion ?? 0) >= 75;
                return navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path) && profileComplete;
                  const disabled = !profileComplete;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        if (disabled) {
                          alert('Please complete your profile to access this.');
                          navigate(userData?.role === 'mentor' ? '/profilementor' : '/profile');
                          return;
                        }
                        navigate(item.path);
                      }}
                      className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                        active
                          ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                          : disabled
                          ? 'opacity-50 cursor-not-allowed text-slate-400'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-300 ${
                        active ? '' : 'group-hover:scale-120 group-hover:rotate-6'
                      }`} />
                      <span className="transition-all duration-300">{item.name}</span>
                      {item.badge > 0 && (
                        <span className="ml-1 flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse transition-all duration-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                });
              })()} 
            </div>   
                  
            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Mobile Quick Actions - Mentors: 2 separate icons, Students: dropdown */}
              {role === 'mentor' ? (
                <div className="flex items-center gap-2 lg:hidden">
                  {(() => {
                    const profileComplete = (userData?.profileCompletion ?? 0) >= 75;
                    return (
                      <>
                        {/* Requests Icon */}
                        <button
                          onClick={() => {
                            if (!profileComplete) {
                              alert('Please complete your profile to access this.');
                              navigate('/profilementor');
                              return;
                            }
                            navigate('/mentor/requests');
                          }}
                          disabled={!profileComplete}
                          className={`relative flex items-center justify-center w-11 h-11 rounded-xl text-purple-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-110 border border-purple-500/20 group transition-all duration-300 ${
                            profileComplete
                              ? 'bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer'
                              : 'bg-slate-700/30 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <FileText className={`w-5 h-5 transition-transform duration-300 ${profileComplete ? 'group-hover:scale-125 group-hover:-rotate-12' : ''}`} />
                          {requestslength > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse transition-all duration-300">
                              {requestslength}
                            </span>
                          )}
                        </button>

                        {/* Active Chats Icon */}
                        <button
                          onClick={() => {
                            if (!profileComplete) {
                              alert('Please complete your profile to access this.');
                              navigate('/profilementor');
                              return;
                            }
                            navigate('/mentor/chats');
                          }}
                          disabled={!profileComplete}
                          className={`relative flex items-center justify-center w-11 h-11 rounded-xl text-purple-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-110 border border-purple-500/20 group transition-all duration-300 ${
                            profileComplete
                              ? 'bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer'
                              : 'bg-slate-700/30 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <MessageSquare className={`w-5 h-5 transition-transform duration-300 ${profileComplete ? 'group-hover:scale-125 group-hover:rotate-12' : ''}`} />
                          {c > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse transition-all duration-300">
                              {c}
                            </span>
                          )}
                        </button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="relative lg:hidden" ref={mobileQuickRef}>
                  {(() => {
                    const profileComplete = (userData?.profileCompletion ?? 0) >= 75;
                    return (
                      <button
                        onClick={() => {
                          if (!profileComplete) {
                            alert('Please complete your profile to access this.');
                            navigate('/profile');
                            return;
                          }
                          navigate("/user/messages");
                        }}
                        disabled={!profileComplete}
                        className={`flex items-center justify-center w-11 h-11 rounded-xl text-purple-300 border border-purple-500/20 group transition-all duration-300 ${
                          profileComplete
                            ? 'bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-110 cursor-pointer'
                            : 'bg-slate-700/30 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <MessageSquare className={`w-5 h-5 transition-transform duration-300 ${profileComplete ? 'group-hover:scale-125' : ''}`} />
                        {c > 0 && (
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse transition-all duration-300">
                            {c}
                          </span>
                        )}
                      </button>
                    );
                  })()}
                </div>
              )}

              {/* Profile Dropdown - Desktop */}
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-purple-500/20 group hover:scale-105"
                >
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform duration-300 group-hover:scale-110">
                    {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-200 text-sm max-w-25 truncate transition-all duration-300">
                    {userData?.fullName || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    showProfileDropdown ? 'rotate-180' : 'group-hover:scale-110'
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden animate-slideDown">
                    {/* Dropdown Header */}
                    <div className="p-5 bg-linear-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg truncate">{userData?.fullName || 'User'}</p>
                          <p className="text-purple-100 text-sm capitalize">{role || 'Student'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    <div className="p-2">
                      {userData.role=="student"? <Link
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">View Profile</span>
                      </Link>:<Link
                        to="/profilementor"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">View Profile</span>
                      </Link>}
                      <div className="my-2 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  const profileComplete = (userData?.profileCompletion ?? 0) >= 75;
                  if (!profileComplete) {
                    alert('Please complete your profile to access navigation.');
                    navigate(userData?.role === 'mentor' ? '/profilementor' : '/profile');
                    return;
                  }
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className={`lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 ${
                  ((userData?.profileCompletion ?? 0) >= 75)
                    ? 'bg-linear-to-br from-purple-600 to-pink-600 hover:scale-105 cursor-pointer'
                    : 'bg-slate-700/50 opacity-50 cursor-not-allowed'
                }`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-purple-500/20 shadow-xl animate-slideDown max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Profile Info */}
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-md">
                  {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="relative">
                  <p className="font-bold text-white">{userData?.fullName || 'User'}</p>
                  <p className="text-sm text-purple-100 capitalize">{role || 'Student'}</p>
                </div>
              </div>

              {/* Mobile Nav Items */}
              {(() => {
                const profileComplete = (userData?.profileCompletion ?? 0) >= 75;
                return navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path) && profileComplete;
                  const disabled = !profileComplete;
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (!profileComplete) {
                          alert('Please complete your profile to access this.');
                          navigate(userData?.role === 'mentor' ? '/profilementor' : '/profile');
                          return;
                        }
                        navigate(item.path);
                      }}
                      className={`relative w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-300 group hover:scale-105 origin-left ${
                        active
                          ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                          : disabled
                          ? 'text-slate-400 opacity-50 cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg hover:shadow-purple-500/20'
                      }`}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="transition-all duration-300">{item.name}</span>
                      {item.badge > 0 && (
                        <span className="ml-auto flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse transition-all duration-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                });
              })()} 

              <div className="my-4 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>

              {/* Mobile Profile Links */}
              {userData.role=="student"? <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>View Profile</span>
              </Link>:<Link
                to="/profilementor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>View Profile</span>
              </Link>}
              
              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-all duration-300 border-2 border-red-500/20 hover:border-red-500/40 mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
  
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes linear-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-linear-x {
          background-size: 200% 200%;
          animation: linear-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default NavBar;