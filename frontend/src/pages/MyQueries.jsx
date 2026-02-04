
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

  // ✅ Sync Redux → local state
  useEffect(() => {
    if (Array.isArray(questions)) {
      setMyQuestions(questions);
      setFilteredQuestions(questions);
    } else {
      setMyQuestions([]);
      setFilteredQuestions([]);
    }
    setLoading(false);
  }, [questions]);

  // ✅ Filtering logic (fixed dependencies + naming)
  useEffect(() => {
    let filtered = myQuestions;

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
  }, [searchQuery, selectedCategory, myQuestions]);
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
    if (question.responses && question.responses.length > 0) {
      return {
        icon: CheckCircle,
        label: "Answered",
        color: "from-green-500 to-emerald-500"
      };
    }
    return {
      icon: Clock,
      label: "Waiting",
      color: "from-yellow-500 to-amber-500"
    };
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-white"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <button
              onClick={() => navigate("/user/ask-question")}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-xl"
            >
              <Plus size={18} /> Ask New Question
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-black text-white mb-2">
              My Queries
            </h1>
            <p className="text-slate-300">
              Track and manage your questions
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 text-white"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-center text-slate-300">
              Loading...
            </p>
          ) : filteredQuestions.length > 0 ? (
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const badge = getStatusBadge(q);
                const Icon = badge.icon;

                return (
                  <div
                    key={q._id}
                    className="bg-slate-800/50 rounded-xl p-6 text-white"
                  >
                    <div className="flex justify-between mb-3">
                      <h3 className="text-xl font-bold">{q.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-lg bg-linear-to-r ${badge.color}`}
                      >
                        <Icon size={14} /> {badge.label}
                      </span>
                    </div>

                    <p className="text-slate-300 mb-4">
                      {q.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex gap-1">
                        <Calendar size={14} /> {formatDate(q.createdAt)}
                      </span>
                      <span className="flex gap-1">
                        <MessageCircle size={14} />
                        {q.responses?.length || 0} responses
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => navigate(`/question/${q._id}`)}
                        className="px-4 py-2 bg-purple-600 rounded-lg"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => navigate(`/question/${q._id}/edit`)}
                        className="px-4 py-2 bg-slate-700 rounded-lg"
                      >
                        <Edit size={14} /> Edit
                      </button>

                      <button
                        onClick={() => setDeleteConfirm(q._id)}
                        className="px-4 py-2 bg-red-600 rounded-lg ml-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                    {deleteConfirm === q._id && (
                      <div className="mt-4 flex justify-between items-center bg-red-500/10 p-3 rounded-lg">
                        <span className="flex items-center gap-2 text-red-300">
                          <AlertCircle size={16} />
                          Confirm delete?
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-slate-700 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="px-3 py-1 bg-red-600 rounded"
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
            <p className="text-center text-slate-300">
              No questions found
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyQueries;
