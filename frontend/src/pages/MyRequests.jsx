import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { Send, Clock, FileText, CheckCircle, Eye, User, MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from "../Redux/chatSlice";

function MyRequests() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | pending | accepted

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res1 = await axios.get(
          `${serverUrl}/api/questions/mentor-requests`,
          { withCredentials: true },
        );
       

        // // Properly combine both arrays
        // const broadcastQuestions = res1.data || [];
        // const assignedQuestions = res2.data || [];
        const allRequests = res1.data

        setRequests(allRequests);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };
  const {userData}=useSelector(state=>state.user)
  const handleAccept = async (reqId) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === reqId ? { ...r, status: "accepted" } : r)),
    );
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
  const handleChat=async (questionId)=>{
    try {
      const result=await axios.get(`${serverUrl}/api/chats/question/${questionId}`,{withCredentials:true})
      dispatch(setActiveChat(result.data))
      navigate(`/mentor/chats`)
    } catch (error) {
      console.log(error)
    }
  }
 

  const filtered = requests.filter((r) =>
    filter === "all" ? true : (r.status === filter || r.questionType==filter),
  );

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 animate-slide-down">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 backdrop-blur-xl border border-purple-500/20 mb-4">
                <Send className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">
                  Mentor Requests
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  Requests
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                See all requests sent by students — accept ones you can take on.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap ${filter === "all" ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-purple-500/40"}`}
              >
                All
              </button>
               <button
                onClick={() => setFilter("specific")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap ${filter === "specific" ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-purple-500/40"}`}
              >
                For You
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap ${filter === "pending" ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-purple-500/40"}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-xl whitespace-nowrap ${filter === "accepted" ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-purple-500/40"}`}
              >
                Accepted
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {loading ? (
              <div className="text-slate-400">Loading requests...</div>
            ) : filtered.length === 0 ? (
              <div className="text-slate-400">No requests to show.</div>
            ) : (
              filtered.map((req) => (
                <div
                  key={req._id}
                  className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs text-slate-400">
                      {req.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                        req.questionType === "specific"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {req.questionType === "specific"
                        ? "👤 For You"
                        : "👥 Open to All"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">
                    {req.title}
                  </h3>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                    {req.author?.profileImage ? (
                      <img
                        src={req.author.profileImage}
                        alt={req.author.fullName}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        {req.author?.fullName?.charAt(0) || "?"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {req.author.fullName}
                      </p>
                      <p className="text-xs text-slate-400">
                        Requested • {formatDate(req.createdAt)}
                      </p>
                    </div>
                    <div className="text-sm shrink-0">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${req.status === "accepted" ? "bg-linear-to-r from-green-400 to-emerald-400 text-white" : "bg-yellow-700/10 text-yellow-300 border border-yellow-500/20"}`}
                      >
                        {req.status === "accepted" ? "Accepted" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={() => navigate(`/question/${req._id}`)}
                      className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500/40 transition-all text-sm"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span>View</span>
                    </button>

                    {req.status === "accepted" ? (
                      <button
                        onClick={()=>handleChat(req._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transition-all"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Chat</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAccept(req._id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm bg-linear-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Accept</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </>
  );
}

export default MyRequests;
