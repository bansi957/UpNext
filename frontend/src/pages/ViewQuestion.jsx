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
  User
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import { deleteQuestion } from '../Redux/userSlice';

function ViewQuestion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userData } = useSelector(state => state.user);
  const [question, setQuestion] = useState(null);
 const dispatch=useDispatch()

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

              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  View Question
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-2">
                Read the details, see attachments and manage your question
              </p>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden animate-fade-in p-8 md:p-10">
            {!question ? (
              <div className="text-center py-20">
                <p className="text-slate-400">Question not found or still loading...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-900/60 flex items-center justify-center overflow-hidden border border-slate-700">
                      {question?.author?.profileImage ? (
                        <img src={question.author.profileImage} alt="author" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-7 h-7 text-slate-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{question.author?.fullName || 'Unknown'}</h3>
                      <p className="text-sm text-slate-400">{formatDate(question.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-900/40 border border-purple-500/20 text-purple-300">{question.category}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${question.responses && question.responses.length > 0 ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white' : 'bg-yellow-700/10 text-yellow-300 border border-yellow-500/20'}`}>
                      {question.responses && question.responses.length > 0 ? 'Answered' : 'Waiting'}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{question.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(question.tags || []).map(tag => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-lg bg-slate-900/50 border border-slate-700 text-slate-300">{tag}</span>
                    ))}
                  </div>

                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{question.description}</p>
                </div>

                {question.attachment && (
                  <div className="rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-900/30">
                    <img src={question.attachment} alt="attachment" className="w-full object-cover max-h-96" />
                  </div>
                )}

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{question.responses ? question.responses.length : 0} responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {userData && userData._id === question.author?._id && (
                      <>
                        <button onClick={() => navigate(`/question/${question._id}/edit`)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium shadow-2xl shadow-purple-500/50 hover:scale-105 transition-all">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button onClick={()=>handleDeleteQuestion(id)} className="px-3 py-2 rounded-xl bg-red-600/80 text-white font-medium hover:bg-red-700 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-bold text-white mb-4">Responses</h4>
                  {question.responses && question.responses.length > 0 ? (
                    <div className="space-y-4">
                      {question.responses.map((res) => (
                        <div key={res._id || res.id} className="bg-slate-900/40 border border-slate-700 rounded-2xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center overflow-hidden">
                              {res.author?.profileImage ? (
                                <img src={res.author.profileImage} alt="res-author" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-slate-400" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="text-sm font-semibold text-white">{res.author?.fullName || 'Mentor'}</h5>
                                <span className="text-xs text-slate-400">{formatDate(res.createdAt)}</span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">{res.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-700 text-slate-400">No responses yet. Be the first to respond!</div>
                  )}
                </div>

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
