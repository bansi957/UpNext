import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Star,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
  Flame,
  Trophy,
  Target,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import NavBar from './NavBar';

function MentorHome() {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Dynamic greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

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
                  <span className="text-purple-300 text-sm font-medium">Making a Difference</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 animate-slide-up tracking-tight">
                  <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                    {greeting},
                  </span>
                  <br />
                  <span className="text-white">{userData?.fullName || 'Mentor'}!</span>
                </h1>

                <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-slide-up-delayed leading-relaxed">
                  Please complete your mentor profile to accept requests and access the app.
                </p>

                <div className="max-w-2xl mx-auto mt-6">
                  <div className="flex items-center justify-between gap-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-xl">
                    <div>
                      <strong>Fill your profile to accept requests</strong>
                      <div className="text-slate-400 text-sm">Add your expertise, availability and bio so students can request you</div>
                    </div>
                    <div>
                      <button onClick={() => navigate('/profilementor')} className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium">Complete Profile</button>
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

  const stats = [
    { icon: Send, label: 'Pending Requests', value: '5', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, label: 'Active Chats', value: '8', color: 'from-blue-500 to-cyan-500' },
    { icon: Star, label: 'Your Rating', value: '4.9', color: 'from-yellow-500 to-orange-500' }
  ];

  const pendingRequests = [
    {
      id: 1,
      title: "Need guidance on transitioning from mechanical to software",
      student: "Rahul Verma",
      studentAvatar: "RV",
      category: "Career Switch",
      urgency: "high",
      postedDate: "30 mins ago",
      studentYear: "Final Year",
      college: "IIT Delhi"
    },
    {
      id: 2,
      title: "How to prepare for Google SDE interview?",
      student: "Priya Patel",
      studentAvatar: "PP",
      category: "Interview Prep",
      urgency: "medium",
      postedDate: "2 hours ago",
      studentYear: "Pre-Final Year",
      college: "NIT Trichy"
    },
    {
      id: 3,
      title: "Should I pursue MS or gain work experience first?",
      student: "Amit Kumar",
      studentAvatar: "AK",
      category: "Education",
      urgency: "low",
      postedDate: "5 hours ago",
      studentYear: "Final Year",
      college: "BITS Pilani"
    },
    {
      id: 4,
      title: "Advice on startup vs corporate for first job",
      student: "Sneha Singh",
      studentAvatar: "SS",
      category: "Career Path",
      urgency: "medium",
      postedDate: "1 day ago",
      studentYear: "Final Year",
      college: "IIT Bombay"
    }
  ];

  const activeChats = [
    {
      id: 1,
      studentName: "Ankit Sharma",
      studentAvatar: "AS",
      lastMessage: "Thank you so much! That really helps clarify things.",
      timestamp: "5 mins ago",
      unread: 1,
      topic: "Frontend Development Roadmap",
      messagesCount: 15
    },
    {
      id: 2,
      studentName: "Divya Nair",
      studentAvatar: "DN",
      lastMessage: "Could you share some resources for system design?",
      timestamp: "1 hour ago",
      unread: 2,
      topic: "System Design Interview",
      messagesCount: 23
    },
    {
      id: 3,
      studentName: "Rohan Gupta",
      studentAvatar: "RG",
      lastMessage: "I've completed the projects you suggested!",
      timestamp: "3 hours ago",
      unread: 0,
      topic: "Project Guidance",
      messagesCount: 31
    },
    {
      id: 4,
      studentName: "Meera Joshi",
      studentAvatar: "MJ",
      lastMessage: "The interview went great! Thanks for your tips 🎉",
      timestamp: "Yesterday",
      unread: 0,
      topic: "Interview Preparation",
      messagesCount: 42
    }
  ];

  const recentActivity = [
    {
      type: "streak",
      message: "7 Day Response Streak! Keep it up! 🔥",
      time: "Today",
      icon: Flame,
      color: "from-orange-500 to-red-500"
    },
    {
      type: "milestone",
      message: "You've helped 50 students reach their goals! 🎉",
      time: "2 days ago",
      icon: Trophy,
      color: "from-purple-500 to-pink-500"
    },
    {
      type: "appreciation",
      message: "5 students thanked you this week",
      time: "3 days ago",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <>
      <NavBar />
      
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-6 animate-slide-down">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Making a Difference</span>
              </div>

              {/* Complete profile banner for mentors */}
              {userData?.profileCompletion < 75 && (
                <div className="max-w-2xl mx-auto mt-6">
                  <div className="flex items-center justify-between gap-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-xl">
                    <div>
                      <strong>Fill your profile to accept requests</strong>
                      <div className="text-slate-400 text-sm">Add your expertise, availability and bio so students can request you</div>
                    </div>
                    <div>
                      <button onClick={() => navigate('/profilementor')} className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium">Complete Profile</button>
                    </div>
                  </div>
                </div>
              )}
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 animate-slide-up tracking-tight">
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  {greeting},
                </span>
                <br />
                <span className="text-white">{userData?.fullName || 'Mentor'}!</span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 animate-slide-up-delayed leading-relaxed">
                Your guidance is shaping future careers ✨
              </p>

              {/* Primary CTA */}
              <button 
                onClick={() => navigate('/mentor/requests')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105 animate-bounce-slow overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Zap className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">View All Requests</span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
              </button>
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

            {/* Pending Requests Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                Pending Requests
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.urgency === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        request.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {request.urgency === 'high' ? 'Urgent' : request.urgency === 'medium' ? 'Normal' : 'Low Priority'}
                      </span>
                      <span className="text-xs text-slate-500">{request.category}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {request.title}
                    </h3>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                        {request.studentAvatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{request.student}</p>
                        <p className="text-xs text-slate-400">{request.studentYear} • {request.college}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{request.postedDate}</span>
                      </div>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                        <span>Accept</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Chats & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Active Chats */}
              <div>
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  Active Conversations
                </h2>
                
                <div className="space-y-4">
                  {activeChats.map((chat, index) => (
                    <div
                      key={chat.id}
                      className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                            {chat.studentAvatar}
                          </div>
                          {chat.unread > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-slate-800">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">
                              {chat.studentName}
                            </h3>
                            <span className="text-xs text-slate-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-xs text-purple-300 mb-2">{chat.topic}</p>
                          <p className="text-sm text-slate-400 line-clamp-1">{chat.lastMessage}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs text-slate-500">{chat.messagesCount} messages</span>
                            <button className="ml-auto flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-all">
                              Reply
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity & Guidelines */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    Recent Activity
                  </h2>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={index}
                          className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${activity.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-200 leading-relaxed mb-1">
                                {activity.message}
                              </p>
                              <p className="text-xs text-slate-500">{activity.time}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mentor Guidelines */}
                <div className="bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl animate-float">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">💡 Mentor Guidelines</h3>
                      <p className="text-sm text-white/90 mb-4 leading-relaxed">
                        Respond within 24 hours, be respectful and empathetic, provide actionable advice. Your guidance shapes careers!
                      </p>
                      <button 
                        onClick={() => navigate('/mentor/guidelines')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-all"
                      >
                        <span>Read Full Guidelines</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
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

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default MentorHome;