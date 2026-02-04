import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Lock,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Book,
  Eye,
  Heart,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function Guidelines() {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(0);

  const guidelines = [
    {
      id: 1,
      icon: Shield,
      title: 'Privacy is Paramount',
      description: 'Protect student information at all costs',
      details: [
        'Never share student personal information with third parties',
        'Keep all student data confidential and secure',
        'Do not store or request personal documents or files unnecessarily',
        'Respect student privacy preferences and settings',
        'Never disclose student information on public platforms',
        'Use student data only for mentoring purposes'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 2,
      icon: Heart,
      title: 'Be Polite & Respectful',
      description: 'Maintain professionalism in all interactions',
      details: [
        'Use courteous language in all communications',
        'Respond to messages within 24-48 hours when possible',
        'Avoid using slang or inappropriate language',
        'Listen actively to student concerns and questions',
        'Be patient with students regardless of their level',
        'Acknowledge and validate student feelings and concerns',
        'Never belittle or demean a student for any reason'
      ],
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      id: 3,
      icon: Eye,
      title: 'No Personal Content Requests',
      description: 'Maintain professional boundaries',
      details: [
        'Never ask for personal photos or selfies',
        'Do not request social media handles or personal accounts',
        'Avoid asking about family, relationships, or personal life',
        'Do not request personal identification documents',
        'Never ask for home address or location details',
        'Keep all conversations focused on mentoring topics',
        'Do not invite students to personal social media'
      ],
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      id: 4,
      icon: MessageSquare,
      title: 'Communication Within Platform',
      description: 'Use UpNext for all official communications',
      details: [
        'All mentoring conversations must happen on UpNext platform',
        'Never request student phone numbers for communication',
        'Do not share personal email or phone numbers',
        'Do not exchange WhatsApp, Telegram, or other messaging apps',
        'Report any student attempts to move communication off-platform',
        'Use the messaging feature for all discussions',
        'Document all important information within UpNext'
      ],
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 5,
      icon: AlertCircle,
      title: 'Strict Disciplinary Rules',
      description: 'Follow community guidelines and conduct policies',
      details: [
        'Violation of these guidelines may result in account suspension',
        'Repeated misconduct will lead to permanent account termination',
        'Any form of harassment will be immediately reported to authorities',
        'Exploitative behavior will result in legal action',
        'Maintain professional conduct at all times',
        'Report any suspicious activity or policy violations',
        'Understand that violations are tracked and documented',
        'Accept full responsibility for all actions on the platform'
      ],
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10'
    },
    {
      id: 6,
      icon: Zap,
      title: 'Professional Excellence',
      description: 'Provide high-quality mentoring',
      details: [
        'Provide accurate and helpful guidance based on expertise',
        'Stay updated with industry trends and developments',
        'Give constructive and actionable feedback',
        'Be honest about limitations in your expertise',
        'Help students set realistic goals and timelines',
        'Follow up on student progress and check-ins',
        'Maintain detailed notes on mentee progress'
      ],
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-12 animate-slide-down">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 mb-6 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-purple-500/40"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-4">
              <Book className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-sm font-medium">Mentor Guidelines</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                Community Guidelines
              </span>
            </h1>
            <p className="text-slate-400 text-lg">
              Follow these guidelines to maintain a safe, professional, and productive mentoring environment
            </p>
          </div>

          {/* Introduction Card */}
          <div className="mb-12 p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-purple-500/20 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Your Role as a Mentor</h2>
                <p className="text-slate-300">
                  As a mentor on UpNext, you're not just sharing knowledge—you're building trust with students who rely on your guidance. These guidelines ensure a safe, respectful, and professional community where everyone can thrive. Adherence to these guidelines is mandatory and violations may result in account suspension or termination.
                </p>
              </div>
            </div>
          </div>

          {/* Guidelines Sections */}
          <div className="space-y-4 animate-fade-in">
            {guidelines.map((guideline, index) => {
              const Icon = guideline.icon;
              const isExpanded = expandedSection === guideline.id;

              return (
                <div
                  key={guideline.id}
                  className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(guideline.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/20 transition-all"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-linear-to-br ${guideline.color} bg-opacity-10`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{guideline.title}</h3>
                        <p className="text-sm text-slate-400">{guideline.description}</p>
                      </div>
                    </div>

                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-purple-400 transition-transform" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-400 transition-transform" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-700/50">
                      <ul className="space-y-3">
                        {guideline.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="mt-12 p-6 rounded-2xl bg-linear-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 animate-fade-in">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-300 mb-2">Important Notice</h3>
                <p className="text-slate-300 mb-3">
                  By becoming a mentor on UpNext, you acknowledge that:
                </p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>✓ You have read and understood all community guidelines</li>
                  <li>✓ You agree to follow these guidelines in all interactions</li>
                  <li>✓ You understand violations may result in account termination</li>
                  <li>✓ You are responsible for your actions and communications</li>
                  <li>✓ UpNext reserves the right to take legal action if necessary</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <button
              onClick={() => navigate('/mentor/dashboard')}
              className="px-8 py-3 rounded-xl bg-slate-800/50 text-white border border-slate-700 hover:border-purple-500/40 transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all"
            >
              I Agree & Continue
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 3s ease infinite; }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.3; transform: scale(1.1); } }
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      `}</style>
    </>
  );
}

export default Guidelines;
