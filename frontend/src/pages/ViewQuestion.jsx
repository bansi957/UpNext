import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../components/NavBar';
import {
  ArrowLeft,
  FileText,
  Tag,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Edit,
  Trash2,
  User,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import { deleteQuestion } from '../Redux/UserSlice';
import { setActiveChat } from '../Redux/chatSlice';

function ViewQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useSelector(state => state.user);
  const [question, setQuestion] = useState(null);
  const [acceptingRequest, setAcceptingRequest] = useState(false);
  const dispatch = useDispatch();

  // const handleAcceptRequest = async (questionId) => {
  //   setAcceptingRequest(true);
  //   try {
  //     await axios.post(
  //       `${serverUrl}/api/questions/${questionId}/accept`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     alert("Question accepted! You can now respond.");
  //     // Optionally refresh the question data
  //     const result = await axios.get(`${serverUrl}/api/questions/${questionId}`, { withCredentials: true });
  //     setQuestion(result.data);
  //   } catch (error) {
  //     console.error("Error accepting question:", error);
  //     alert("Failed to accept question");
  //   } finally {
  //     setAcceptingRequest(false);
  //   }
  // };

  const handleChat=async (questionId)=>{
    try {
      const result=await axios.get(`${serverUrl}/api/chats/question/${questionId}`,{withCredentials:true})
      dispatch(setActiveChat(result.data))
      navigate(`/user/messages`)
    } catch (error) {
      console.log(error)
    }
  }
 
  const handleAcceptRequest = async (reqId) => {
    try {
      const res=await axios.put(
        `${serverUrl}/api/questions/update-status`,
        {status:"accepted",mentorId:userData._id,questionId:reqId},
        { withCredentials: true },
      );
      
      // Get the chat details before navigating
      if(res.data.chatId) {
        try {
          const chatRes = await axios.get(
            `${serverUrl}/api/chats/${res.data.chatId}`,
            { withCredentials: true }
          );
          // Set the active chat in Redux
          dispatch(setActiveChat(chatRes.data));
        } catch(chatErr) {
          console.error("Error fetching chat details:", chatErr);
        }
      }
      
      // Navigate to active chats
      navigate(`/mentor/chats`)
    } catch (err) {
      console.warn("Accept request failed (dev):", err?.message || err);
    }
  };
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `${serverUrl}/api/questions/delete/${questionId}`,
        { withCredentials: true }
      );
      navigate("/user/queries")
      dispatch(deleteQuestion(questionId))
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };


  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

   useEffect(()=>{
    const fetchData=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/questions/${id}`,{withCredentials:true})
            console.log(result)
            setQuestion(result.data)
            
        } catch (error) {
            console.log(error)
        }
    }
    fetchData()
  },[id])

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">

          <div className="mb-8 animate-slide-down">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/20 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-4 animate-slide-down">
                <FileText className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Question Details</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  View Question
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto mb-2">
                Read the details, see attachments and manage your question
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden animate-fade-in p-4 sm:p-6 md:p-8 lg:p-10">
            {!question ? (
              <div className="text-center py-20">
                <p className="text-slate-400">Question not found or still loading...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                      {question?.author?.profileImage ? (
                        <img src={question.author.profileImage} alt="author" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">{question.author?.fullName || 'Unknown'}</h3>
                      <p className="text-xs sm:text-sm text-slate-400">{formatDate(question.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-slate-900/40 border border-purple-500/20 text-purple-300">{question.category}</span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      question.status === 'accepted' 
                        ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white' 
                        : question.status === 'completed'
                        ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-yellow-700/10 text-yellow-300 border border-yellow-500/20'
                    }`}>
                      {question.status === 'accepted' ? 'Accepted' : question.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      question.questionType === 'specific' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {question.questionType === 'specific' ? '👤 Specific Mentor' : '👥 Open to All'}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3">{question.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(question.tags || []).map(tag => (
                      <span key={tag} className="text-xs px-2 sm:px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-300">{tag}</span>
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed whitespace-pre-line">{question.description}</p>
                </div>

                {question.attachment && (
                  <div className="rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-900/30">
                    <img src={question.attachment} alt="attachment" className="w-full object-cover max-h-64 sm:max-h-80 md:max-h-96" />
                  </div>
                )}

                {question.questionType === 'specific' && question.targetMentor && (
                  <div className="rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 p-4 sm:p-6">
                    <p className="text-xs sm:text-sm text-blue-300 font-semibold mb-4 flex items-center gap-2">
                      <span>👤 This question was sent specifically to:</span>
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                        {question.targetMentor?.profileImage ? (
                          <img src={question.targetMentor.profileImage} alt="mentor" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 sm:w-6 h-5 sm:h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">{question.targetMentor?.fullName}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 truncate">{question.targetMentor?.domain || question.targetMentor?.position}</p>
                      </div>
                    </div>
                  </div>
                )}

                {question.questionType === 'all' && question.status === 'accepted' && userData?.role !== 'mentor' && question.acceptedBy && (
                  <div className="rounded-2xl border-2 border-green-500/40 bg-green-500/10 p-4 sm:p-6">
                    <p className="text-xs sm:text-sm text-green-300 font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Your question was accepted by:</span>
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                        {question.acceptedBy?.profileImage ? (
                          <img src={question.acceptedBy.profileImage} alt="accepted mentor" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 sm:w-6 h-5 sm:h-6 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">{question.acceptedBy?.fullName}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 truncate">{question.acceptedBy?.domain || question.acceptedBy?.position}</p>
                      </div>
                    </div>
                  </div>
                )}

                {question.status === 'completed' && userData?.role !== 'mentor' && question.acceptedBy && (
                  <div className="rounded-2xl border-2 border-blue-500/40 bg-blue-500/10 p-4 sm:p-6">
                    <p className="text-xs sm:text-sm text-blue-300 font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Your question was solved by:</span>
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                          {question.acceptedBy?.profileImage ? (
                            <img src={question.acceptedBy.profileImage} alt="mentor" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 sm:w-6 h-5 sm:h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">{question.acceptedBy?.fullName}</h4>
                          <p className="text-xs sm:text-sm text-slate-400 truncate">{question.acceptedBy?.domain || question.acceptedBy?.position}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChat(question._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>View Chat</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400">
                      <div className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 shrink-0" />
                      <span className="text-xs sm:text-sm">{question.responses ? question.responses.length : 0} responses</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
                      <span className="text-xs sm:text-sm">{formatDate(question.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {userData?.role === 'mentor' ? (
                      <button
                        onClick={() => handleAcceptRequest(question._id)}
                        disabled={acceptingRequest || question.status === 'accepted'}
                        className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-green-600 to-emerald-600 text-white font-medium text-sm shadow-2xl shadow-green-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{acceptingRequest ? 'Accepting...' : question.status === 'accepted' ? 'Already Accepted' : 'Accept Request'}</span>
                      </button>
                    ) : (
                      userData && userData._id === question.author?._id && (
                        <>
                          {question.status !== 'accepted' && question.status !== 'completed' && (
                            <button onClick={() => navigate(`/question/${question._id}/edit`)} className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium text-sm shadow-2xl shadow-purple-500/50 hover:scale-105 transition-all">
                              <Edit className="w-4 h-4 shrink-0" />
                              <span>Edit</span>
                            </button>
                          )}
                          {question.status !== 'accepted' && question.status !== 'completed' && (
                            <button onClick={()=>handleDeleteQuestion(id)} className="flex items-center justify-center px-4 py-2 rounded-xl bg-red-600/80 text-white font-medium text-sm hover:bg-red-700 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )
                    )}
                  </div>
                </div>

                {question.status === 'accepted' && (
                  <div className="mt-8">
                    <button
                      onClick={() => handleChat(question._id)}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 text-white font-medium text-sm sm:text-base shadow-2xl shadow-blue-500/50 hover:scale-105 transition-all w-full sm:w-auto"
                    >
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
                      <span>Go to Chat</span>
                    </button>
                  </div>
                )}

              </div>
            )}
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

export default ViewQuestion;
