import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Star,
  Award,
  Briefcase,
  Code,
  Send,
  Calendar,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  Sparkles,
  CheckCircle,
  Target,
  Users,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';

function MentorProfilePage() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { mentors } = useSelector(state => state.user);

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadMentor() {
      setLoading(true);
      try {
        let m = null;
        if (mentors && mentors.length > 0) {
          m = mentors.find(x => String(x._id) === String(mentorId));
        }
        if (m) {
          setMentor({
            ...m,
            domain: m.domain || 'General',
            profileImage: m.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.fullName,
            tagline: m.tagline || m.position || 'Industry Mentor',
            experience: m.experience || `${m.yearsOfExperience || 0}+ years`,
            rating: m.rating ?? 4.7,
            studentsHelped: m.studentsHelped ?? 120,
            skills: m.skills || [],
            mentorshipAreas: m.mentorshipAreas || m.mentorshipFocus || [],
          });
        } else {
          const res = await axios.get(`${serverUrl}/api/mentors/${mentorId}`, { withCredentials: true });
          const data = res.data;
          setMentor(data);
        }
      } catch (err) {
        console.error('Failed to load mentor', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMentor();
    return () => (mounted = false);
  }, [mentorId, mentors]);

  const handleAskQuestion = () => {
    navigate('/user/ask-question', { 
      state: { targetMentorId: mentorId, questionType: 'specific' } 
    });
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!mentor) return null;

  const ratingPercentage = (mentor.rating / 5) * 100;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 transition-all duration-300 text-slate-200 font-medium mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          {/* Profile Header */}
          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-6 sm:p-10 mb-8 overflow-hidden">
            <div className="relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 rounded-3xl" />
              
              <div className="relative flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                {/* Profile Image */}
                <div className="relative mx-auto sm:mx-0">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50" />
                  <img
                    src={mentor.profileImage}
                    alt={mentor.fullName}
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-purple-500/30 shadow-2xl object-cover"
                  />
                </div>

                {/* Info Section */}
                <div className="flex-1 w-full">
                  <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
                    {mentor.fullName}
                  </h1>

                  <p className="text-purple-300 font-bold text-lg mb-2">
                    {mentor.domain}
                  </p>

                  <p className="text-slate-300 italic text-sm sm:text-base mb-6 line-clamp-2">
                    "{mentor.tagline}"
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold">{mentor.rating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm">/5.0</span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                      <Users className="w-5 h-5 text-green-400" />
                      <span className="text-white font-bold">{mentor.studentsHelped}+</span>
                      <span className="text-slate-400 text-sm">Students</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-bold text-sm">{mentor.experience}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleAskQuestion}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-2 group"
                  >
                    <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
                    Ask Question
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {/* Rating Chart */}
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-8 flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-6">Mentor Rating</h3>
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#grad)"
                    strokeWidth="8"
                    strokeDasharray={`${(ratingPercentage / 100) * 314} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{mentor.rating.toFixed(1)}</span>
                  <span className="text-yellow-400">{'★'.repeat(Math.floor(mentor.rating))}</span>
                </div>
              </div>
              <p className="text-slate-400 text-center text-sm">Out of 5.0 Stars</p>
            </div>

            {/* Students Helped Chart */}
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-8 flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-6">Students Helped</h3>
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="8"
                  />
                  {/* Progress circle - assuming max 500 students for realistic visualization */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#grad2)"
                    strokeWidth="8"
                    strokeDasharray={`${Math.min((mentor.studentsHelped / 500) * 314, 314)} 314`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{mentor.studentsHelped}+</span>
                  <span className="text-green-400 text-sm">Students</span>
                </div>
              </div>
              <p className="text-slate-400 text-center text-sm">Guided to Success</p>
            </div>
          </div>

          {/* About & Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* About Section */}
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">About</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {mentor.bio || 'Passionate mentor dedicated to helping students achieve their goals and grow their skills.'}
              </p>
            </div>

            {/* Mentorship Focus */}
            {mentor.mentorshipAreas.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Mentorship Focus</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mentor.mentorshipAreas.slice(0, 6).map(area => (
                    <div
                      key={area}
                      className="flex items-center gap-2 px-4 py-3 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          {mentor.skills.length > 0 && (
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-purple-500/20 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Skills & Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action Bottom */}
          <div className="bg-linear-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-3xl border border-purple-500/30 p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Ready to learn from {mentor.fullName.split(' ')[0]}?
            </h3>
            <p className="text-slate-300 mb-6">
              Ask a specific question and get personalized guidance from this experienced mentor.
            </p>
            <button
              onClick={handleAskQuestion}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              Ask a Question Now
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}

export default MentorProfilePage;
