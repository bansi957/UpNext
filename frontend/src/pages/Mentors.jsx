import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Send,
  Star,
  MessageCircle,
  Badge,
  Filter,
  ArrowLeft,
  Sparkles,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';

function Mentors() {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [sendingRequestTo, setSendingRequestTo] = useState(null);
  const [sentRequests, setSentRequests] = useState({});

  // Sample mentor data - Replace with API call
  const mockMentors = [
    {
      _id: '1',
      fullName: 'Priya Sharma',
      domain: 'Web Development',
      tagline: 'Full-stack developer | React & Node.js expert',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      bio: 'Senior developer with 5+ years of experience in web development',
      company: 'Google',
      experience: '5+ years',
      rating: 4.8,
      studentsHelped: 156,
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
    },
    {
      _id: '2',
      fullName: 'Vikram Patel',
      domain: 'Machine Learning',
      tagline: 'ML Engineer | TensorFlow & PyTorch specialist',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
      bio: 'ML researcher and engineer working on AI solutions',
      company: 'Microsoft',
      experience: '4+ years',
      rating: 4.9,
      studentsHelped: 203,
      skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP']
    },
    {
      _id: '3',
      fullName: 'Anjali Singh',
      domain: 'Data Science',
      tagline: 'Data Scientist | Big Data & Analytics',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali',
      bio: 'Data scientist passionate about transforming data into insights',
      company: 'Amazon',
      experience: '6+ years',
      rating: 4.7,
      studentsHelped: 189,
      skills: ['Python', 'SQL', 'Tableau', 'Big Data']
    },
    {
      _id: '4',
      fullName: 'Rajesh Kumar',
      domain: 'Web Development',
      tagline: 'Full-stack expert | Building scalable applications',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      bio: 'Architect of large-scale web applications',
      company: 'Meta',
      experience: '7+ years',
      rating: 4.8,
      studentsHelped: 245,
      skills: ['React', 'Vue.js', 'Node.js', 'Kubernetes']
    },
    {
      _id: '5',
      fullName: 'Neha Verma',
      domain: 'Cloud Computing',
      tagline: 'Cloud Architect | AWS & Azure expert',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha',
      bio: 'Cloud infrastructure specialist and DevOps enthusiast',
      company: 'IBM',
      experience: '5+ years',
      rating: 4.6,
      studentsHelped: 167,
      skills: ['AWS', 'Azure', 'Kubernetes', 'Docker']
    },
    {
      _id: '6',
      fullName: 'Arjun Desai',
      domain: 'Mobile App Development',
      tagline: 'Mobile Developer | React Native & Flutter',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
      bio: 'Cross-platform mobile app developer',
      company: 'Apple',
      experience: '4+ years',
      rating: 4.9,
      studentsHelped: 178,
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin']
    },
    {
      _id: '7',
      fullName: 'Deepika Roy',
      domain: 'Cybersecurity',
      tagline: 'Security Expert | Ethical Hacking & Penetration Testing',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepika',
      bio: 'Cybersecurity specialist focused on application security',
      company: 'Cisco',
      experience: '6+ years',
      rating: 4.7,
      studentsHelped: 142,
      skills: ['Ethical Hacking', 'Penetration Testing', 'SSL/TLS', 'OWASP']
    },
    {
      _id: '8',
      fullName: 'Sanjay Malhotra',
      domain: 'DevOps',
      tagline: 'DevOps Engineer | CI/CD Pipeline expert',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay',
      bio: 'Automation and infrastructure expert',
      company: 'Netflix',
      experience: '5+ years',
      rating: 4.8,
      studentsHelped: 156,
      skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI']
    }
  ];

  const domains = [
    'all',
    'Web Development',
    'Machine Learning',
    'Data Science',
    'Cloud Computing',
    'Mobile App Development',
    'Cybersecurity',
    'DevOps'
  ];

  // Load mentors
  useEffect(() => {
    setLoading(true);
    // Replace with actual API call
    setMentors(mockMentors);
    setFilteredMentors(mockMentors);
    setLoading(false);
  }, []);

  // Filter mentors based on search and domain
  useEffect(() => {
    let filtered = mentors;

    // Filter by domain
    if (selectedDomain !== 'all') {
      filtered = filtered.filter(m => m.domain === selectedDomain);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort: prioritize same domain as student
    filtered.sort((a, b) => {
      const aIsSameDomain = a.domain === userData?.domain ? 1 : 0;
      const bIsSameDomain = b.domain === userData?.domain ? 1 : 0;
      if (aIsSameDomain !== bIsSameDomain) return bIsSameDomain - aIsSameDomain;
      return b.rating - a.rating;
    });

    setFilteredMentors(filtered);
  }, [searchQuery, selectedDomain, mentors, userData?.domain]);

  const handleSendRequest = async (mentorId) => {
    setSendingRequestTo(mentorId);
    try {
      const response = await axios.post(
        `${serverUrl}/api/mentorship/send-request`,
        { mentorId },
        { withCredentials: true }
      );

      setSentRequests(prev => ({
        ...prev,
        [mentorId]: true
      }));

      setTimeout(() => {
        setSendingRequestTo(null);
      }, 500);
    } catch (error) {
      console.error('Error sending request:', error);
      setSendingRequestTo(null);
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <>
      <NavBar />
      
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/20 mb-8 animate-slide-down"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-6 animate-slide-down">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-sm font-medium">Your UpNext Mentors</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 animate-slide-up tracking-tight">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                Find Your Perfect Mentor
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 animate-slide-up-delayed">
              Connect with industry experts who can guide your career journey
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, domain, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* Domain Filter */}
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '300ms' }}>
              {domains.map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 capitalize ${
                    selectedDomain === domain
                      ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500/40'
                  }`}
                >
                  {domain === 'all' ? 'All Domains' : domain}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Active Mentors</p>
                  <p className="text-3xl font-black text-white">{mentors.length}</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Award className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Avg. Rating</p>
                  <p className="text-3xl font-black text-white">4.8★</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Students Helped</p>
                  <p className="text-3xl font-black text-white">1400+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-300 font-medium">Loading mentors...</p>
              </div>
            </div>
          ) : filteredMentors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map((mentor, index) => {
                const isSameDomain = mentor.domain === userData?.domain;
                const isRequested = sentRequests[mentor._id];

                return (
                  <div
                    key={mentor._id}
                    className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Badge for same domain */}
                    {isSameDomain && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-white text-xs font-bold shadow-lg">
                          <Badge className="w-3 h-3" />
                          Same Domain
                        </div>
                      </div>
                    )}

                    {/* Cover Image */}
                    <div className="h-32 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 relative group-hover:scale-110 transition-transform duration-300" />

                    {/* Content */}
                    <div className="p-6 relative">
                      {/* Profile Image */}
                      <div className="flex justify-center -mt-20 mb-4 relative z-10">
                        <div className="w-32 h-32 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden">
                          <img
                            src={mentor.profileImage}
                            alt={mentor.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <h3 className="text-2xl font-bold text-white text-center mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                        {mentor.fullName}
                      </h3>

                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{mentor.rating}</span>
                        <span className="text-sm text-slate-400">({mentor.studentsHelped} students)</span>
                      </div>

                      {/* Domain Tag */}
                      <div className="inline-flex w-full mb-4">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-center">
                          <p className="text-sm font-bold text-purple-300">{mentor.domain}</p>
                        </div>
                      </div>

                      {/* Tagline */}
                      <p className="text-center text-slate-300 font-medium mb-4 text-sm italic">
                        "{mentor.tagline}"
                      </p>

                      {/* Company & Experience */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-center gap-2 text-slate-300">
                          <Award className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{mentor.company}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{mentor.experience}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <p className="text-xs text-slate-400 font-bold mb-2">TOP SKILLS</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md border border-slate-600/50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleSendRequest(mentor._id)}
                          disabled={isRequested || sendingRequestTo === mentor._id}
                          className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                            isRequested
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-not-allowed'
                              : sendingRequestTo === mentor._id
                              ? 'bg-slate-700/50 text-slate-300 opacity-60'
                              : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95'
                          }`}
                        >
                          {isRequested ? (
                            <>
                              <Send className="w-4 h-4" />
                              Request Sent
                            </>
                          ) : sendingRequestTo === mentor._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Request
                            </>
                          )}
                        </button>

                        <button onClick={()=>navigate("/mentor/profile")} className="w-full py-3 rounded-xl font-bold border-2 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2 group">
                          <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Users className="w-16 h-16 text-slate-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-300 font-medium mb-2">No mentors found</p>
                <p className="text-slate-400">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
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

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </>
  );
}

export default Mentors;
