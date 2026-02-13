
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import NavBar from "../components/NavBar";
import {
  ArrowLeft,
  FileText,
  Tag,
  Calendar,
  Eye,
  MessageCircle,
  Search,
  Plus,
  Sparkles,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { deleteQuestion } from "../Redux/userSlice";
import { setActiveChat } from "../Redux/chatSlice";

function MyQueries() {
  const navigate = useNavigate();

  // ✅ Correct Redux selector
  const questions = useSelector((state) => state.user.questions);

  // ✅ Local state (renamed clearly)
  const [myQuestions, setMyQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const categories = [
    "all",
    "Career Guidance",
    "Technical Help",
    "Internship",
    "Interview Preparation",
    "Resume Review",
    "Project Help",
    "Higher Studies",
    "Soft Skills",
    "Other"
  ];

  // ✅ Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/questions/myquestions`, {
          withCredentials: true
        });
        setMyQuestions(res.data || []);
        setFilteredQuestions(res.data || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setMyQuestions([]);
        setFilteredQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // ✅ Filtering logic (fixed dependencies + naming)
  useEffect(() => {
    let filtered = myQuestions;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((q) => {
        if (selectedStatus === "pending") {
          return q.status == "pending";
        } else if (selectedStatus === "completed") {
          return q.status === "completed";
        }
        else if(selectedStatus=="accepted"){
              return q.status === "accepted";

        }
        return true;
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (q) => q.category === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredQuestions(filtered);
  }, [searchQuery, selectedCategory, selectedStatus, myQuestions]);
  const dispatch=useDispatch()
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `${serverUrl}/api/questions/delete/${questionId}`,
        { withCredentials: true }
      );
      setMyQuestions((prev) =>
        prev.filter((q) => q._id !== questionId)
      );
      dispatch(deleteQuestion(questionId))
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Failed to delete question");
    }
  };

  const getStatusBadge = (question) => {
    if (question.status === 'accepted') {
      return {
        icon: CheckCircle,
        label: "Accepted",
        color: "from-green-500 to-emerald-500"
      };
    }
    if (question.status === 'completed') {
      return {
        icon: CheckCircle,
        label: "Completed",
        color: "from-blue-500 to-cyan-500"
      };
    }
    return {
      icon: Clock,
      label: "Pending",
      color: "from-yellow-500 to-amber-500"
    };
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

 

     const handleChat=async (questionId)=>{
    try {
      const result=await axios.get(`${serverUrl}/api/chats/question/${questionId}`,{withCredentials:true})
      dispatch(setActiveChat(result.data))
      navigate(`/user/messages`)
    } catch (error) {
      console.log(error)
    }
  }
 
  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white transition-all w-fit"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <button
              onClick={() => navigate("/user/ask-question")}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
            >
              <Plus size={18} /> Ask New Question
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
              My Queries
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Track and manage your questions
            </p>
          </div>

          {/* Search */}
          <div className="mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 rounded-xl bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mb-3">STATUS</p>
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
              {["all", "pending", "accepted", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap ${
                    selectedStatus === status
                      ? status === "pending"
                        ? "bg-yellow-600 text-white shadow-lg shadow-yellow-500/30"
                        : status === "accepted"
                        ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                        : status === "completed"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {status === "all" ? "All" : status === "pending" ? "⏳ Pending" : status === "accepted" ? "✓ Accepted" : "✔ Completed"}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mb-3">CATEGORY</p>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-center text-slate-300 py-8">
              Loading...
            </p>
          ) : filteredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {filteredQuestions.map((q) => {
                const badge = getStatusBadge(q);
                const Icon = badge.icon;

                return (
                  <div
                    key={q._id}
                    className="bg-slate-800/50 hover:bg-slate-800/70 rounded-xl p-4 sm:p-6 text-white transition-all border border-slate-700/50 hover:border-purple-500/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <h3 className="text-lg sm:text-xl font-bold break-words flex-1">{q.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs rounded-lg font-semibold whitespace-nowrap ${
                          q.questionType === 'specific' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {q.questionType === 'specific' ? '👤 Specific' : '👥 Open'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-lg bg-linear-to-r ${badge.color} flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm`}
                        >
                          <Icon size={14} /> {badge.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4 text-sm sm:text-base line-clamp-2">
                      {q.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 mb-4">
                      <span className="flex gap-1 items-center">
                        <Calendar size={14} /> {formatDate(q.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => navigate(`/question/${q._id}`)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-all"
                      >
                        <Eye size={14} /> View
                      </button>

                      {q.status !== 'accepted' && q.status !== 'completed' && (
                        <button
                          onClick={() => navigate(`/question/${q._id}/edit`)}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-all"
                        >
                          <Edit size={14} /> Edit
                        </button>
                      )}

                      {q.status === 'accepted' && (
                        <button
                          onClick={() =>handleChat(q._id)}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-all"
                        >
                          <MessageCircle size={14} /> Chat
                        </button>
                      )}

                      {q.status !== 'accepted' && q.status !== 'completed' && (
                        <button
                          onClick={() => setDeleteConfirm(q._id)}
                          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-all ml-auto"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>

                    {deleteConfirm === q._id && (
                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-red-500/10 p-3 sm:p-4 rounded-lg">
                        <span className="flex items-center gap-2 text-red-300 text-sm">
                          <AlertCircle size={16} />
                          Confirm delete?
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-300 py-8">
              No questions found
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyQueries;
