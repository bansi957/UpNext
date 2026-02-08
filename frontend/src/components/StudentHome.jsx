
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setActiveChat } from '../Redux/chatSlice';
import { 
  MessageCircle, 
  Send, 
  Sparkles,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  Zap,
  Rocket,
  Lightbulb,
  Target
} from 'lucide-react';
import NavBar from './NavBar';

function StudentHome() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [recentConversations, setRecentConversations] = useState([]);
  const [stats, setStats] = useState([
    { icon: Send, label: 'Active Requests', value: '0', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, label: 'Conversations', value: '0', color: 'from-blue-500 to-cyan-500' },
    { icon: Award, label: 'Completed', value: '0', color: 'from-green-500 to-emerald-500' }
  ]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Fetch recent conversations and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const chatsRes = await axios.get(`${serverUrl}/api/chats/get-student-chats`, {
          withCredentials: true
        });

        const chats = chatsRes.data || [];
        setRecentConversations(chats.slice(0, 3));

        setStats([
          { icon: Send, label: 'Active Requests', value: chats.length > 0 ? chats.length.toString() : '0', color: 'from-purple-500 to-pink-500' },
          { icon: MessageCircle, label: 'Conversations', value: chats.length.toString(), color: 'from-blue-500 to-cyan-500' },
          { icon: Award, label: 'Completed', value: '0', color: 'from-green-500 to-emerald-500' }
        ]);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    if (userData?.profileCompletion >= 75) {
      fetchData();
    }
  }, [userData]);

  // Mouse position tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const motivationalQuotes = [
    {
      quote: "Your career journey starts with a single conversation",
      icon: Lightbulb,
      gradient: 'from-purple-500 via-pink-500 to-purple-500'
    },
    {
      quote: "Every mentor was once where you are now",
      icon: Target,
      gradient: 'from-blue-500 via-cyan-500 to-blue-500'
    },
    {
      quote: "Growth happens outside your comfort zone",
      icon: Rocket,
      gradient: 'from-green-500 via-emerald-500 to-green-500'
    }
  ];

  const quickActions = [
    {
      icon: Send,
      title: 'Ask a Question',
      description: 'Get expert guidance from mentors',
      color: 'from-purple-500 to-pink-500',
      path: '/user/ask-question',
      highlight: true
    },
    {
      icon: Users,
      title: 'Browse Mentors',
      description: 'Find the perfect mentor for you',
      color: 'from-blue-500 to-cyan-500',
      path: '/user/mentors'
    },
    {
      icon: BookOpen,
      title: 'Resources',
      description: 'Access learning materials',
      color: 'from-green-500 to-emerald-500',
      path: '/user/resources'
    }
  ];

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // If user exists and profile completion is below threshold, show minimal view only
  const incomplete = userData && (userData.profileCompletion ?? 0) < 75;
  if (incomplete) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-6 animate-slide-down">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span className="text-purple-300 text-sm font-medium">Welcome to UpNext</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 animate-slide-up tracking-tight">
                  <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                    {greeting},
                  </span>
                  <br />
                  <span className="text-white">{userData?.fullName || 'Student'}!</span>
                </h1>

                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-slide-up-delayed leading-relaxed">
                  Please complete your profile to access the full app features.
                </p>

                <div className="max-w-2xl mx-auto mt-6">
                  <div className="flex items-center justify-between gap-4 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-4 py-3 rounded-xl">
                    <div>
                      <strong>Complete your profile to ask questions</strong>
                      <div className="text-slate-400 text-sm">Add your education, skills and bio to get better mentor matches</div>
                    </div>
                    <div>
                      <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium">Complete Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs with Parallax */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"
            style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float-delayed"
            style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-6 animate-slide-down">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Welcome to UpNext</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 animate-slide-up tracking-tight">
                
                  <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  {greeting},
                </span>
                <br />
                <span className="text-white">{userData?.fullName || 'Student'}!</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-slide-up-delayed leading-relaxed">
                Ready to unlock your potential and shape your dream career?
              </p>

              {/* Primary CTA */}
              <button 
                onClick={() => {
                  if (userData?.profileCompletion === 100) navigate('/user/ask-question');
                  else {
                    alert('Please complete your profile to ask questions');
                    navigate('/profile');
                  }
                }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105 animate-bounce-slow overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Ask Your Question Now</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>

              {/* Complete profile banner */}
              {userData?.profileCompletion < 75 && (
                <div className="max-w-2xl mx-auto mt-6">
                  <div className="flex items-center justify-between gap-4 bg-orange-500/10 border border-orange-500/20 text-orange-300 px-4 py-3 rounded-xl">
                    <div>
                      <strong>Complete your profile to ask questions</strong>
                      <div className="text-slate-400 text-sm">Add your education, skills and bio to get better mentor matches</div>
                    </div>
                    <div>
                      <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium">Complete Profile</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                      <div className="text-slate-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="mb-16">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 text-left overflow-hidden ${
                        action.highlight ? 'ring-2 ring-purple-500/50' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${action.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                          {action.title}
                        </h3>
                        
                        <p className="text-slate-400 mb-4">
                          {action.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all duration-300">
                          <span>Get Started</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Conversations & Motivation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Conversations */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  Recent Conversations
                </h2>
                
                {loading ? (
                  <div className="p-8 text-center text-slate-400">Loading conversations...</div>
                ) : recentConversations.length === 0 ? (
                  <div className="p-12 text-center bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-purple-500/20">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-slate-400 text-lg">No conversations yet</p>
                    <p className="text-slate-500 text-sm mt-2">Ask a question to start chatting with mentors</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentConversations.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => {
                          dispatch(setActiveChat(chat));
                          navigate('/user/messages');
                        }}
                        className="group w-full bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            {chat.mentorImage ? (
                              <img
                                src={chat.mentorImage}
                                alt={chat.mentorName}
                                className="w-12 h-12 rounded-xl object-cover shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
                                {chat.mentorName?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                                {chat.mentorName}
                              </p>
                              <span className="text-xs text-slate-500 shrink-0 ml-2">{formatDate(chat.lastMessageTime)}</span>
                            </div>
                            <p className="text-xs text-purple-300 mb-2 truncate">{chat.questionTitle || 'Conversation'}</p>
                            <p className="text-sm text-slate-400 line-clamp-1">{chat.lastMessage || 'No messages yet'}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Motivational Section */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  Your Journey
                </h2>
                
                {/* Rotating Quote */}
                <div className="relative h-64 mb-6">
                  {motivationalQuotes.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className={`absolute inset-0 bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 flex flex-col items-center justify-center text-center transition-all duration-700 ${
                          index === currentQuote ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-xl animate-float`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-white leading-relaxed">
                          "{item.quote}"
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Quote Indicators */}
                <div className="flex justify-center gap-2">
                  {motivationalQuotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuote(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentQuote 
                          ? 'bg-purple-500 w-8' 
                          : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}

export default StudentHome;