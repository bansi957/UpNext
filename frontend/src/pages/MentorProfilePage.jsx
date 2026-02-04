
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
  Target
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
  const [activeTab, setActiveTab] = useState('overview');
  const [sendingRequest, setSendingRequest] = useState(false);

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
            availability: m.availability || {
              hoursPerMonth: 8,
              responseTime: '< 2 hours',
              timezone: 'IST (UTC +5:30)',
              availableDays: []
            },
            education: m.education || [],
            workExperience: m.workExperience || [],
            testimonials: m.testimonials || [],
            socialLinks: m.socialLinks || {}
          });
        } else {
          // Fallback: fetch from API if not in store
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

  const handleSendRequest = async () => {
    setSendingRequest(true);
    try {
      await axios.post(
        `${serverUrl}/api/mentorship/send-request`,
        { mentorId },
        { withCredentials: true }
      );
      setIsRequested(true);
    } catch (err) {
      alert('Failed to send request');
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!mentor) return null;

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto relative z-10">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-300 hover:text-white"
            >
              <ArrowLeft /> Back
            </button>


          </div>

          {/* Profile Card */}
          <div className="bg-slate-800/40 rounded-3xl border border-purple-500/20 p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={mentor.profileImage}
                alt={mentor.fullName}
                className="w-40 h-40 rounded-2xl border-4 border-slate-700"
              />

              <div className="flex-1">
                <h1 className="text-4xl font-black text-white">
                  {mentor.fullName}
                </h1>

                <p className="text-purple-300 font-bold mt-1">
                  {mentor.domain}
                </p>

                <p className="text-slate-300 italic mt-2">
                  "{mentor.tagline}"
                </p>

                <div className="flex gap-6 mt-4 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    {mentor.rating}
                  </span>
                  <span>{mentor.studentsHelped}+ students</span>
                  <span>{mentor.availability.responseTime}</span>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSendRequest}
                    disabled={isRequested || sendingRequest}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold disabled:opacity-60"
                  >
                    {isRequested
                      ? 'Request Sent'
                      : sendingRequest
                      ? 'Sending...'
                      : 'Send Request'}
                  </button>


                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700 mt-10 mb-8">
              {['overview', 'skills', 'experience', 'testimonials'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold capitalize ${
                    activeTab === tab
                      ? 'text-purple-400 border-b-2 border-purple-500'
                      : 'text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <Section title="About Me" icon={BookOpen}>
                  {mentor.bio}
                </Section>

                <Section title="Teaching Style" icon={Target}>
                  {mentor.teachingStyle}
                </Section>

                <Section title="What I Help With" icon={Sparkles}>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {mentor.mentorshipAreas.map(area => (
                      <li
                        key={area}
                        className="flex gap-2 bg-slate-800/50 p-3 rounded-lg"
                      >
                        <CheckCircle className="text-green-400" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>
            )}

            {/* Skills */}
            {activeTab === 'skills' && (
              <Section title="Skills & Expertise" icon={Code}>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-10">
                <Section title="Education" icon={Award}>
                  {mentor.education.map(e => (
                    <p key={e.institute}>
                      {e.degree} — {e.institute} ({e.year})
                    </p>
                  ))}
                </Section>

                <Section title="Work Experience" icon={Briefcase}>
                  {mentor.workExperience.map(job => (
                    <div key={job.company}>
                      <p className="font-bold">{job.position}</p>
                      <p className="text-slate-400">
                        {job.company} • {job.duration}
                      </p>
                      <p className="text-slate-300">{job.description}</p>
                    </div>
                  ))}
                </Section>
              </div>
            )}

            {/* Testimonials */}
            {activeTab === 'testimonials' && (
              <div className="grid md:grid-cols-2 gap-6">
                {mentor.testimonials.map(t => (
                  <div
                    key={t.studentName}
                    className="bg-slate-800/50 p-6 rounded-xl"
                  >
                    <p className="font-bold text-white">{t.studentName}</p>
                    <p className="text-yellow-400">
                      {'★'.repeat(Math.floor(t.rating))}
                    </p>
                    <p className="text-slate-300 mt-2">{t.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-10 bg-slate-800/40 p-6 rounded-2xl border border-purple-500/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Connect with {mentor.fullName.split(' ')[0]}
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {mentor.socialLinks.github && (
                <SocialLink
                  href={mentor.socialLinks.github}
                  icon={Github}
                  label="GitHub"
                />
              )}
              {mentor.socialLinks.linkedin && (
                <SocialLink
                  href={mentor.socialLinks.linkedin}
                  icon={Linkedin}
                  label="LinkedIn"
                />
              )}
              {mentor.socialLinks.portfolio && (
                <SocialLink
                  href={mentor.socialLinks.portfolio}
                  icon={Globe}
                  label="Portfolio"
                />
              )}
            </div>
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

/* Helper Components */

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon className="text-purple-400" />
        {title}
      </h3>
      <div className="text-slate-300">{children}</div>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-700/50"
    >
      <Icon className="text-slate-400" />
      <span className="text-slate-300">{label}</span>
    </a>
  );
}

export default MentorProfilePage;
