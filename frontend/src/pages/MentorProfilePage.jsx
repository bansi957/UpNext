// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Star,
//   Award,
//   Briefcase,
//   Code,
//   Users,
//   MessageCircle,
//   Send,
//   Calendar,
//   MapPin,
//   Globe,
//   Github,
//   Linkedin,
//   BookOpen,
//   TrendingUp,
//   Sparkles,
//   CheckCircle,
//   Clock,
//   Target,
//   Heart,
//   Share2
// } from 'lucide-react';
// import axios from 'axios';
// import { serverUrl } from '../App';
// import NavBar from '../components/NavBar';

// function MentorProfilePage() {
//   const { mentorId } = useParams();
//   const navigate = useNavigate();
//   const [mentor, setMentor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRequested, setIsRequested] = useState(false);
//   const [isFavorited, setIsFavorited] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [sendingRequest, setSendingRequest] = useState(false);

//   // Mock mentor data - Replace with API call
//   const mockMentorData = {
//     _id: '1',
//     fullName: 'Priya Sharma',
//     domain: 'Web Development',
//     tagline: 'Full-stack developer | React & Node.js expert',
//     profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
//     bio: 'I am a passionate full-stack developer with 5+ years of experience in building scalable web applications. I started my career as a frontend developer and gradually transitioned to full-stack development. My expertise lies in React, Node.js, and cloud technologies. I love mentoring beginners and helping them navigate their career in tech.',
//     company: 'Google',
//     experience: '5+ years',
//     rating: 4.8,
//     studentsHelped: 156,
//     responseTime: '< 2 hours',
//     skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'System Design', 'TypeScript', 'REST APIs'],
//     expertise: [
//       { area: 'Full-Stack Development', level: 'Expert' },
//       { area: 'Frontend Architecture', level: 'Expert' },
//       { area: 'Backend Design', level: 'Advanced' },
//       { area: 'DevOps', level: 'Intermediate' }
//     ],
//     socialLinks: {
//       github: 'https://github.com/priyasharma',
//       linkedin: 'https://linkedin.com/in/priyasharma',
//       portfolio: 'https://priyasharma.dev'
//     },
//     education: [
//       { degree: 'B.Tech', field: 'Computer Science', institute: 'IIT Delhi', year: '2018' },
//       { degree: 'Certification', field: 'AWS Solutions Architect', institute: 'Amazon Web Services', year: '2020' }
//     ],
//     workExperience: [
//       { 
//         company: 'Google', 
//         position: 'Senior Software Engineer', 
//         duration: '2022 - Present',
//         description: 'Leading full-stack development for cloud infrastructure projects'
//       },
//       { 
//         company: 'Meta', 
//         position: 'Software Engineer', 
//         duration: '2020 - 2022',
//         description: 'Built and scaled web applications handling millions of users'
//       },
//       { 
//         company: 'Startup XYZ', 
//         position: 'Full-Stack Developer', 
//         duration: '2018 - 2020',
//         description: 'Developed MVP and led technical team of 3 developers'
//       }
//     ],
//     mentorshipAreas: [
//       'Career guidance for web developers',
//       'Interview preparation for tech companies',
//       'System design and architecture',
//       'Building production-ready applications',
//       'Open source contributions'
//     ],
//     availability: {
//       hoursPerMonth: 8,
//       responseTime: '< 2 hours',
//       timezone: 'IST (UTC +5:30)',
//       availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
//     },
//     testimonials: [
//       {
//         studentName: 'Rahul Gupta',
//         rating: 5,
//         feedback: 'Priya helped me transition from frontend to full-stack development. Her practical insights and real-world examples were invaluable!',
//         date: '2 months ago'
//       },
//       {
//         studentName: 'Neha Singh',
//         rating: 5,
//         feedback: 'Got selected at Amazon with her guidance. She prepared me thoroughly for system design rounds.',
//         date: '1 month ago'
//       },
//       {
//         studentName: 'Arjun Verma',
//         rating: 4.5,
//         feedback: 'Very helpful mentor. Answered all my questions patiently and gave me actionable advice.',
//         date: '3 weeks ago'
//       }
//     ],
//     teachingStyle: 'I believe in learning by doing. I provide real-world project examples and encourage hands-on practice. I focus on helping mentees understand the "why" behind concepts, not just the "what".',
//     completedSessions: 156,
//     averageSessionDuration: '45 mins',
//     successStories: 12,
//     topicsDiscussed: ['React', 'Node.js', 'System Design', 'Interview Prep', 'Career Planning']
//   };

//   useEffect(() => {
//     setLoading(true);
//     // Replace with actual API call
//     // const fetchMentor = async () => {
//     //   try {
//     //     const response = await axios.get(
//     //       `${serverUrl}/api/mentors/${mentorId}`,
//     //       { withCredentials: true }
//     //     );
//     //     setMentor(response.data.mentor);
//     //   } catch (error) {
//     //     console.error('Error fetching mentor:', error);
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // };
//     // fetchMentor();
    
//     setTimeout(() => {
//       setMentor(mockMentorData);
//       setLoading(false);
//     }, 500);
//   }, [mentorId]);

//   const handleSendRequest = async () => {
//     setSendingRequest(true);
//     try {
//       await axios.post(
//         `${serverUrl}/api/mentorship/send-request`,
//         { mentorId },
//         { withCredentials: true }
//       );
//       setIsRequested(true);
//       setTimeout(() => setSendingRequest(false), 500);
//     } catch (error) {
//       console.error('Error sending request:', error);
//       setSendingRequest(false);
//       alert(error.response?.data?.message || 'Failed to send request');
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <NavBar />
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-20 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-slate-300 font-medium">Loading mentor profile...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (!mentor) {
//     return (
//       <>
//         <NavBar />
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-20">
//           <div className="max-w-5xl mx-auto px-4 text-center">
//             <p className="text-slate-300 text-lg">Mentor not found</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <NavBar />
      
//       <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        
//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
//           <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
//         </div>

//         <div className="max-w-5xl mx-auto relative z-10">
          
//           {/* Header */}
//           <div className="flex items-center justify-between mb-8 animate-slide-down">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back</span>
//             </button>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setIsFavorited(!isFavorited)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg"
//               >
//                 <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-300'}`} />
//               </button>
//               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg">
//                 <Share2 className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Profile Card */}
//           <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden animate-fade-in mb-8">
            
//             {/* Cover Header */}
//             <div className="h-40 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 relative animate-linear-x">
//               <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/30" />
//               <div className="absolute -bottom-20 left-8">
//                 <div className="w-40 h-40 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden">
//                   <img
//                     src={mentor.profileImage}
//                     alt={mentor.fullName}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Profile Info */}
//             <div className="pt-24 px-8 pb-8">
//               <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
//                 <div>
//                   <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
//                     {mentor.fullName}
//                   </h1>
                  
//                   <div className="inline-block px-4 py-2 rounded-lg bg-linear-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
//                     <p className="text-lg font-bold text-purple-300">{mentor.domain}</p>
//                   </div>

//                   <p className="text-xl text-slate-300 italic mb-4">"{mentor.tagline}"</p>

//                   {/* Quick Stats */}
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
//                       <p className="text-slate-400 text-sm font-medium">Experience</p>
//                       <p className="text-white font-bold">{mentor.experience}</p>
//                     </div>
//                     <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
//                       <p className="text-slate-400 text-sm font-medium">Students Helped</p>
//                       <p className="text-white font-bold">{mentor.studentsHelped}+</p>
//                     </div>
//                     <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
//                       <div className="flex items-center gap-1 mb-1">
//                         <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                         <p className="text-white font-bold">{mentor.rating}</p>
//                       </div>
//                       <p className="text-slate-400 text-sm font-medium">Rating</p>
//                     </div>
//                     <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
//                       <p className="text-slate-400 text-sm font-medium">Response Time</p>
//                       <p className="text-white font-bold">{mentor.availability.responseTime}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col gap-3 mt-6 md:mt-0 md:w-56">
//                   <button
//                     onClick={handleSendRequest}
//                     disabled={isRequested || sendingRequest}
//                     className={`py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
//                       isRequested
//                         ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-not-allowed'
//                         : sendingRequest
//                         ? 'bg-slate-700/50 text-slate-300 opacity-60'
//                         : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-95'
//                     }`}
//                   >
//                     {isRequested ? (
//                       <>
//                         <CheckCircle className="w-5 h-5" />
//                         Request Sent
//                       </>
//                     ) : sendingRequest ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
//                         Sending...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="w-5 h-5" />
//                         Send Request
//                       </>
//                     )}
//                   </button>

//                   <button className="py-3 rounded-xl font-bold border-2 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2 group">
//                     <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                     Message
//                   </button>
//                 </div>
//               </div>

//               {/* Navigation Tabs */}
//               <div className="border-b border-slate-700/50 mb-8 overflow-x-auto">
//                 <div className="flex gap-1 min-w-max">
//                   {['overview', 'skills', 'experience', 'testimonials'].map(tab => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`px-6 py-3 font-bold capitalize transition-all duration-300 border-b-2 ${
//                         activeTab === tab
//                           ? 'border-purple-500 text-purple-400'
//                           : 'border-transparent text-slate-400 hover:text-slate-300'
//                       }`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'overview' && (
//                 <div className="space-y-8 animate-fade-in">
                  
//                   {/* About Section */}
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
//                       <BookOpen className="w-6 h-6 text-blue-400" />
//                       About Me
//                     </h3>
//                     <p className="text-slate-300 leading-relaxed text-lg">{mentor.bio}</p>
//                   </div>

//                   {/* Teaching Style */}
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
//                       <Target className="w-6 h-6 text-green-400" />
//                       My Teaching Style
//                     </h3>
//                     <p className="text-slate-300 leading-relaxed text-lg">{mentor.teachingStyle}</p>
//                   </div>

//                   {/* Mentorship Areas */}
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
//                       <Sparkles className="w-6 h-6 text-purple-400" />
//                       What I Help With
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {mentor.mentorshipAreas.map((area, index) => (
//                         <div
//                           key={index}
//                           className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
//                         >
//                           <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
//                           <p className="text-slate-300">{area}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Availability */}
//                   <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
//                     <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                       <Calendar className="w-6 h-6 text-cyan-400" />
//                       Availability
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <p className="text-slate-400 text-sm font-medium mb-2">Available Days</p>
//                         <div className="flex flex-wrap gap-2">
//                           {mentor.availability.availableDays.map(day => (
//                             <span
//                               key={day}
//                               className="px-3 py-1 bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-lg text-sm font-medium border border-purple-500/30"
//                             >
//                               {day}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div>
//                         <p className="text-slate-400 text-sm font-medium mb-4">Quick Stats</p>
//                         <div className="space-y-2">
//                           <p className="text-slate-300"><span className="font-medium">Hours/Month:</span> {mentor.availability.hoursPerMonth}</p>
//                           <p className="text-slate-300"><span className="font-medium">Timezone:</span> {mentor.availability.timezone}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               }

//               {activeTab === 'skills' && (
//                 <div className="animate-fade-in">
//                   <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                     <Code className="w-6 h-6 text-blue-400" />
//                     Skills & Expertise
//                   </h3>

//                   {/* Technical Skills */}
//                   <div className="mb-8">
//                     <p className="text-slate-400 font-bold mb-4">Technical Skills</p>
//                     <div className="flex flex-wrap gap-2">
//                       {mentor.skills.map(skill => (
//                         <span
//                           key={skill}
//                           className="px-4 py-2 bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-lg font-medium border border-blue-500/30"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Expertise Levels */}
//                   <div>
//                     <p className="text-slate-400 font-bold mb-4">Expertise Areas</p>
//                     <div className="space-y-4">
//                       {mentor.expertise.map((exp, index) => (
//                         <div key={index}>
//                           <div className="flex justify-between mb-2">
//                             <span className="text-slate-300 font-medium">{exp.area}</span>
//                             <span className="text-purple-400 font-bold">{exp.level}</span>
//                           </div>
//                           <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-linear-to-r from-purple-600 to-pink-600 rounded-full"
//                               style={{
//                                 width: exp.level === 'Expert' ? '100%' : exp.level === 'Advanced' ? '85%' : '70%'
//                               }}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               }

//               {activeTab === 'experience' && (
//                 <div className="animate-fade-in">
                  
//                   {/* Education */}
//                   <div className="mb-12">
//                     <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                       <Award className="w-6 h-6 text-green-400" />
//                       Education
//                     </h3>
//                     <div className="space-y-4">
//                       {mentor.education.map((edu, index) => (
//                         <div key={index} className="flex gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
//                           <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0">
//                             <BookOpen className="w-6 h-6 text-green-400" />
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="text-white font-bold">{edu.degree} in {edu.field}</h4>
//                             <p className="text-slate-400">{edu.institute}</p>
//                             <p className="text-slate-500 text-sm">{edu.year}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Work Experience */}
//                   <div>
//                     <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//                       <Briefcase className="w-6 h-6 text-purple-400" />
//                       Work Experience
//                     </h3>
//                     <div className="space-y-4">
//                       {mentor.workExperience.map((work, index) => (
//                         <div key={index} className="flex gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
//                           <div className="w-12 h-12 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center shrink-0">
//                             <Briefcase className="w-6 h-6 text-purple-400" />
//                           </div>
//                           <div className="flex-1">
//                             <h4 className="text-white font-bold">{work.position}</h4>
//                             <p className="text-slate-400">{work.company}</p>
//                             <p className="text-slate-500 text-sm mb-2">{work.duration}</p>
//                             <p className="text-slate-300">{work.description}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               }

//               {activeTab === 'testimonials' && (
//                 <div className="animate-fade-in">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {mentor.testimonials.map((testimonial, index) => (
//                       <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
//                         <div className="flex items-center justify-between mb-4">
//                           <h4 className="text-white font-bold">{testimonial.studentName}</h4>
//                           <div className="flex items-center gap-1">
//                             {[...Array(5)].map((_, i) => (
//                               <Star
//                                 key={i}
//                                 className={`w-4 h-4 ${
//                                   i < Math.floor(testimonial.rating)
//                                     ? 'fill-yellow-400 text-yellow-400'
//                                     : 'text-slate-600'
//                                 }`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="text-slate-300 mb-4">{testimonial.feedback}</p>
//                         <p className="text-slate-500 text-sm">{testimonial.date}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               }
//             </div>
//           </div>

//           {/* Social Links Card */}
//           <div className="bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-8 animate-slide-up">
//             <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//               <Globe className="w-6 h-6 text-cyan-400" />
//               Connect With {mentor.fullName.split(' ')[0]}
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {mentor.socialLinks.github && (
//                 <a
//                   href={mentor.socialLinks.github}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-300"
//                 >
//                   <Github className="w-6 h-6 text-slate-400" />
//                   <div>
//                     <p className="text-slate-300 font-medium">GitHub</p>
//                     <p className="text-slate-500 text-sm">View projects</p>
//                   </div>
//                 </a>
//               )}
//               {mentor.socialLinks.linkedin && (
//                 <a
//                   href={mentor.socialLinks.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-300"
//                 >
//                   <Linkedin className="w-6 h-6 text-slate-400" />
//                   <div>
//                     <p className="text-slate-300 font-medium">LinkedIn</p>
//                     <p className="text-slate-500 text-sm">Professional profile</p>
//                   </div>
//                 </a>
//               )}
//               {mentor.socialLinks.portfolio && (
//                 <a
//                   href={mentor.socialLinks.portfolio}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-300"
//                 >
//                   <Globe className="w-6 h-6 text-slate-400" />
//                   <div>
//                     <p className="text-slate-300 font-medium">Portfolio</p>
//                     <p className="text-slate-500 text-sm">See my work</p>
//                   </div>
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Custom Styles */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.2; transform: scale(1); }
//           50% { opacity: 0.3; transform: scale(1.1); }
//         }

//         @keyframes linear-x {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }

//         .animate-slide-down {
//           animation: slide-down 0.6s ease-out;
//         }

//         .animate-slide-up {
//           animation: slide-up 0.6s ease-out 0.2s both;
//         }

//         .animate-pulse-slow {
//           animation: pulse-slow 4s ease-in-out infinite;
//         }

//         .animate-linear-x {
//           background-size: 200% 200%;
//           animation: linear-x 3s ease infinite;
//         }

//         .delay-700 {
//           animation-delay: 700ms;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Star,
//   Award,
//   Briefcase,
//   Code,
//   MessageCircle,
//   Send,
//   Calendar,
//   Globe,
//   Github,
//   Linkedin,
//   BookOpen,
//   Sparkles,
//   CheckCircle,
//   Target,
//   Heart,
//   Share2
// } from 'lucide-react';
// import axios from 'axios';
// import { serverUrl } from '../App';
// import NavBar from '../components/NavBar';

// function MentorProfilePage() {
//   const { mentorId } = useParams();
//   const navigate = useNavigate();

//   const [mentor, setMentor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isRequested, setIsRequested] = useState(false);
//   const [isFavorited, setIsFavorited] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [sendingRequest, setSendingRequest] = useState(false);

//   const mockMentorData = {
//     _id: '1',
//     fullName: 'Priya Sharma',
//     domain: 'Web Development',
//     tagline: 'Full-stack developer | React & Node.js expert',
//     profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
//     bio: 'I am a passionate full-stack developer with 5+ years of experience in building scalable web applications.',
//     experience: '5+ years',
//     rating: 4.8,
//     studentsHelped: 156,
//     skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
//     mentorshipAreas: [
//       'Career guidance',
//       'Interview preparation',
//       'System design'
//     ],
//     availability: {
//       hoursPerMonth: 8,
//       responseTime: '< 2 hours',
//       timezone: 'IST',
//       availableDays: ['Monday', 'Wednesday', 'Friday']
//     },
//     testimonials: [
//       {
//         studentName: 'Rahul Gupta',
//         rating: 5,
//         feedback: 'Amazing mentor!',
//         date: '2 months ago'
//       }
//     ],
//     socialLinks: {
//       github: 'https://github.com',
//       linkedin: 'https://linkedin.com',
//       portfolio: 'https://example.com'
//     },
//     teachingStyle: 'Hands-on learning with real-world examples'
//   };

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setMentor(mockMentorData);
//       setLoading(false);
//     }, 500);
//   }, [mentorId]);

//   const handleSendRequest = async () => {
//     setSendingRequest(true);
//     try {
//       await axios.post(
//         `${serverUrl}/api/mentorship/send-request`,
//         { mentorId },
//         { withCredentials: true }
//       );
//       setIsRequested(true);
//     } catch (err) {
//       alert('Failed to send request');
//     } finally {
//       setSendingRequest(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <NavBar />
//         <div className="min-h-screen flex items-center justify-center text-white">
//           Loading...
//         </div>
//       </>
//     );
//   }

//   if (!mentor) {
//     return <div>Mentor not found</div>;
//   }

//   return (
//     <>
//       <NavBar />

//       <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-6">
//         <div className="max-w-5xl mx-auto">

//           {/* Header */}
//           <div className="flex justify-between mb-6">
//             <button onClick={() => navigate(-1)} className="text-white flex gap-2">
//               <ArrowLeft /> Back
//             </button>
//             <button onClick={() => setIsFavorited(!isFavorited)}>
//               <Heart className={isFavorited ? 'text-red-500 fill-red-500' : 'text-white'} />
//             </button>
//           </div>

//           {/* Profile */}
//           <div className="bg-slate-800 rounded-3xl p-8 mb-8">
//             <h1 className="text-4xl font-bold text-white">{mentor.fullName}</h1>
//             <p className="text-purple-400">{mentor.domain}</p>
//             <p className="text-slate-300 mt-2">{mentor.tagline}</p>

//             <button
//               onClick={handleSendRequest}
//               disabled={isRequested || sendingRequest}
//               className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl"
//             >
//               {isRequested ? 'Request Sent' : sendingRequest ? 'Sending...' : 'Send Request'}
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-4 border-b border-slate-700 mb-6">
//             {['overview', 'skills', 'testimonials'].map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`pb-2 ${
//                   activeTab === tab ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-400'
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Overview */}
//           {activeTab === 'overview' && (
//             <div className="text-slate-300 space-y-4">
//               <p>{mentor.bio}</p>
//               <p><b>Teaching Style:</b> {mentor.teachingStyle}</p>
//             </div>
//           )}

//           {/* Skills */}
//           {activeTab === 'skills' && (
//             <div className="flex flex-wrap gap-3">
//               {mentor.skills.map(skill => (
//                 <span key={skill} className="bg-purple-500/20 px-4 py-2 rounded-lg text-purple-300">
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* Testimonials */}
//           {activeTab === 'testimonials' && (
//             <div className="space-y-4">
//               {mentor.testimonials.map((t, i) => (
//                 <div key={i} className="bg-slate-800 p-4 rounded-lg">
//                   <p className="text-white font-bold">{t.studentName}</p>
//                   <p className="text-slate-300">{t.feedback}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ FIXED STYLE TAG (NO jsx) */}
//       <style>{`
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }

//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//       `}</style>
//     </>
//   );
// }

// export default MentorProfilePage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Award,
  Briefcase,
  Code,
  MessageCircle,
  Send,
  Calendar,
  Globe,
  Github,
  Linkedin,
  BookOpen,
  Sparkles,
  CheckCircle,
  Target,
  Heart,
  Share2
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';

function MentorProfilePage() {
  console.log("Mentor");
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [sendingRequest, setSendingRequest] = useState(false);

  const mockMentorData = {
    _id: '1',
    fullName: 'Priya Sharma',
    domain: 'Web Development',
    tagline: 'Full-stack developer | React & Node.js expert',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    bio:
      'I am a passionate full-stack developer with 5+ years of experience in building scalable web applications. I love mentoring developers and helping them grow.',
    experience: '5+ years',
    rating: 4.8,
    studentsHelped: 156,
    skills: [
      'React',
      'Node.js',
      'PostgreSQL',
      'AWS',
      'Docker',
      'TypeScript',
      'System Design'
    ],
    expertise: [
      { area: 'Full-Stack Development', level: 'Expert' },
      { area: 'Frontend Architecture', level: 'Expert' },
      { area: 'Backend Design', level: 'Advanced' },
      { area: 'DevOps', level: 'Intermediate' }
    ],
    mentorshipAreas: [
      'Career guidance',
      'Interview preparation',
      'System design',
      'Production apps',
      'Open source'
    ],
    availability: {
      hoursPerMonth: 8,
      responseTime: '< 2 hours',
      timezone: 'IST (UTC +5:30)',
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday']
    },
    teachingStyle:
      'I believe in learning by doing and explaining the "why" behind concepts.',
    education: [
      {
        degree: 'B.Tech',
        field: 'Computer Science',
        institute: 'IIT Delhi',
        year: '2018'
      }
    ],
    workExperience: [
      {
        company: 'Google',
        position: 'Senior Software Engineer',
        duration: '2022 - Present',
        description: 'Leading full-stack development for cloud projects.'
      },
      {
        company: 'Meta',
        position: 'Software Engineer',
        duration: '2020 - 2022',
        description: 'Built web apps used by millions.'
      }
    ],
    testimonials: [
      {
        studentName: 'Rahul Gupta',
        rating: 5,
        feedback: 'Priya helped me crack my first FAANG offer.',
        date: '2 months ago'
      },
      {
        studentName: 'Neha Singh',
        rating: 5,
        feedback: 'Amazing mentor, very patient and practical.',
        date: '1 month ago'
      }
    ],
    socialLinks: {
      github: 'https://github.com/priyasharma',
      linkedin: 'https://linkedin.com/in/priyasharma',
      portfolio: 'https://priyasharma.dev'
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMentor(mockMentorData);
      setLoading(false);
    }, 500);
  }, [mentorId]);

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

            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorited(v => !v)}
                className="p-2 rounded-lg border border-slate-700"
              >
                <Heart
                  className={
                    isFavorited
                      ? 'text-red-500 fill-red-500'
                      : 'text-slate-400'
                  }
                />
              </button>
              <button className="p-2 rounded-lg border border-slate-700">
                <Share2 className="text-slate-400" />
              </button>
            </div>
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

                  <button className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300">
                    <MessageCircle className="inline mr-2" />
                    Message
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
