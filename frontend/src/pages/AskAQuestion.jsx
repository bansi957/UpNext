import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Send,
  AlertCircle,
  CheckCircle,
  X,
  Image as ImageIcon,
  FileText,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import NavBar from '../components/NavBar';
import { addQuestion} from '../Redux/userSlice';

function AskAQuestion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    questionType: location.state?.questionType || 'all', // 'all' for all mentors, 'specific' for one mentor
    targetMentorId: location.state?.targetMentorId || '' // only used when questionType is 'specific'
  });
  const [mentorsList, setMentorsList] = useState([]);
  const mentors = useSelector(state => state.user.mentors || []);

  const categories = [
    'Career Guidance',
    'Technical Help',
    'Internship',
    'Interview Preparation',
    'Resume Review',
    'Project Help',
    'Higher Studies',
    'Soft Skills',
    'Other'
  ];

  const commonTags = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Dev',
    'Cloud Computing',
    'AI/ML',
    'DevOps',
    'System Design',
    'Career',
    'Interview',
    'Internship',
    'Placement',
    'Resume'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  useEffect(() => {
    if (Array.isArray(mentors)) {
      setMentorsList(mentors);
    }
  }, [mentors]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };
const dispatch=useDispatch()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a question title');
      return;
    }
    if (formData.title.length < 10) {
      setError('Title must be at least 10 characters long');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (formData.questionType === 'specific' && !formData.targetMentorId) {
      setError('Please select a mentor for this question');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('tags', formData.tags);
      data.append('questionType', formData.questionType);
      if (formData.questionType === 'specific') {
        data.append('targetMentorId', formData.targetMentorId);
      }
      if (imageFile) {
        data.append('image', imageFile);
      }

      const response = await axios.post(
        `${serverUrl}/api/questions/create`,
        data,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setSuccess(true);
      setFormData({ title: '', description: '', category: '', tags: [], questionType: 'all', targetMentorId: '' });
      setImagePreview(null);
      setImageFile(null);
      dispatch(addQuestion(response.data.question))
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Header */}
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
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium">Get Expert Help</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                  Ask Your Question
                </span>
              </h1>

              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-2">
                Share your doubts and get guidance from experienced mentors
              </p>
              <p className="text-slate-400">
                Be clear and detailed for better responses
              </p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl flex items-start gap-4 animate-slide-up">
              <CheckCircle className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-300 mb-1">Question Posted Successfully!</h3>
                <p className="text-green-200 text-sm">Redirecting to home page...</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden animate-fade-in p-8 md:p-10">
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Question Type */}
              <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                  Question Type <span className="text-pink-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.questionType === 'all'
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="questionType"
                      value="all"
                      checked={formData.questionType === 'all'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.questionType === 'all' ? 'border-purple-500 bg-purple-500' : 'border-slate-500'
                      }`}>
                        {formData.questionType === 'all' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Open to All Mentors</p>
                        <p className="text-xs text-slate-400">All mentors can see & respond</p>
                      </div>
                    </div>
                  </label>

                  <label className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.questionType === 'specific'
                      ? 'bg-blue-500/20 border-blue-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}>
                    <input
                      type="radio"
                      name="questionType"
                      value="specific"
                      checked={formData.questionType === 'specific'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        formData.questionType === 'specific' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                      }`}>
                        {formData.questionType === 'specific' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">Send to Specific Mentor</p>
                        <p className="text-xs text-slate-400">Only one mentor can respond</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Select Mentor (only if specific) */}
              {formData.questionType === 'specific' && (
                <div className="animate-slide-up" style={{ animationDelay: '75ms' }}>
                  <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Select Mentor <span className="text-pink-400">*</span>
                  </label>
                  <select
                    name="targetMentorId"
                    value={formData.targetMentorId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white"
                  >
                    <option value="">Choose a mentor...</option>
                    {mentorsList.map(mentor => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.fullName} - {mentor.domain}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Question Title */}
              <div className="animate-slide-up">
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Question Title <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., How do I prepare for software engineering interviews?"
                  maxLength={150}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white placeholder:text-slate-500 font-medium"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-400">Be specific and clear about your question</p>
                  <span className={`text-xs font-medium ${formData.title.length > 130 ? 'text-pink-400' : 'text-slate-500'}`}>
                    {formData.title.length}/150
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Category <span className="text-pink-400">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-400" />
                  Description <span className="text-pink-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about your question. What have you tried so far? What's the specific issue you're facing?"
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none text-white placeholder:text-slate-500 font-medium"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-400">Detailed questions get better answers</p>
                  <span className={`text-xs font-medium ${formData.description.length > 1800 ? 'text-pink-400' : 'text-slate-500'}`}>
                    {formData.description.length}/2000
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Tags (Optional)
                </label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 rounded-xl bg-slate-900/30 border border-slate-700/50">
                  {commonTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        formData.tags.includes(tag)
                          ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700'
                      } hover:scale-105 cursor-pointer`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <label className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-400" />
                  Attach Screenshot/Image (Optional)
                </label>

                {!imagePreview ? (
                  <label className="relative group cursor-pointer">
                    <div className="w-full px-6 py-8 border-2 border-dashed border-slate-700 rounded-2xl bg-slate-900/30 hover:bg-slate-900/50 transition-all duration-300 flex flex-col items-center justify-center group-hover:border-purple-500/40">
                      <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-purple-400 transition-colors" />
                      <p className="text-slate-300 font-medium text-center">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/40 bg-slate-900/30">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-96 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-4 right-4 p-2 bg-red-600/90 hover:bg-red-700 rounded-lg transition-all duration-300 shadow-lg"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-green-600/90 px-4 py-2 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">Image Ready</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl flex items-start gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed animate-slide-up"
                style={{ animationDelay: '500ms' }}
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>{loading ? 'Posting Your Question...' : 'Post Question'}</span>
              </button>

              {/* Helper Text */}
              <p className="text-center text-slate-400 text-sm">
                ✨ Your question will be visible to experienced mentors across all domains
              </p>
            </form>
          </div>
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
            transform: translateY(20px);
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
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

        /* Custom Scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9333ea, #ec4899);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a855f7, #f472b6);
        }
      `}</style>
    </>
  );
}

export default AskAQuestion;
