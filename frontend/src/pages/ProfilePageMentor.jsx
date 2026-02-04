import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Code,
  Award,
  Target,
  BookOpen,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Save,
  ArrowLeft,
  Edit2,
  Camera,
  Sparkles,
  Clock,
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Heart
} from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { addUserData } from "../Redux/userSlice";

const ProfilePageMentor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user?.userData);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    tagline: "",
    company: "",
    position: "",
    yearsOfExperience: "",
    domain: "",
    skills: [],
    expertise: [],
    certifications: [],
    mentorshipFocus: [],
    teaching_style: "",
   
    linkedin: "",
    github: "",
    portfolio: "",
    achievements: "",
  });

  const domains = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "Blockchain",
    "UI/UX Design",
    "System Design",
    "Other"
  ];

  const skillOptions = [
    "JavaScript", "Python", "Java", "C", "C++", "Go", "Rust", "TypeScript",
    "React", "Next.js", "Angular", "Vue.js", "Node.js", "Express.js", "Django",
    "Flask", "Spring Boot", "FastAPI", "MongoDB", "MySQL", "PostgreSQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux",
    "Machine Learning", "TensorFlow", "PyTorch", "System Design", "REST APIs", "GraphQL"
  ];

  const mentorshipAreas = [
    "Career Guidance",
    "Interview Preparation",
    "System Design",
    "Code Review",
    "Project Mentoring",
    "Resume Review",
    "Mock Interviews",
    "Technical Skills",
    "Soft Skills",
    "Startup Guidance",
    "Open Source Contributions",
    "Research & Publications"
  ];


  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        tagline: userData.tagline || "",
        company: userData.company || "",
        position: userData.position || "",
        yearsOfExperience: userData.yearsOfExperience || "",
        domain: userData.domain || "",
        skills: userData.skills || [],
        expertise: userData.expertise || [],
        certifications: userData.certifications || [],
        mentorshipFocus: userData.mentorshipFocus || [],
        teaching_style: userData.teaching_style || "",
        linkedin: userData.linkedin || "",
        github: userData.github || "",
        portfolio: userData.portfolio || "",
        achievements: userData.achievements || "",
      });
      setProfileImage(userData.profileImage || null);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter((v) => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // compute mentor completion and include in form data
      const _mentorFields = [
        formData.fullName,
        formData.email,
        formData.phone,
        formData.bio,
        formData.tagline,
        formData.company,
        formData.position,
        formData.yearsOfExperience,
        formData.domain,
        (formData.skills || []).length > 0,
        (formData.expertise || []).length > 0,
        (formData.mentorshipFocus || []).length > 0,
        formData.teaching_style,
        formData.linkedin,
        formData.github,
        formData.portfolio,
        formData.achievements
      ];
      const profileCompletion = Math.round(((_mentorFields.filter(Boolean).length / _mentorFields.length) * 100));

      const data = new FormData();
      // attach the computed completion into the form data so backend updates it
      formData["profileCompletion"] = profileCompletion;
      data.append("formData", JSON.stringify(formData));

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const response = await axios.post(
        `${serverUrl}/api/auth/updateprofile`,
        data,
        { withCredentials: true }
      );

      dispatch(addUserData(response.data.user));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };  

  // Mentor profile completion used in UI
  const _mentorFields = [
    formData.fullName,
    formData.email,
    formData.phone,
    formData.bio,
    formData.tagline,
    formData.company,
    formData.position,
    formData.yearsOfExperience,
    formData.domain,
    (formData.skills || []).length > 0,
    (formData.expertise || []).length > 0,
    (formData.mentorshipFocus || []).length > 0,
    formData.teaching_style,
    formData.linkedin,
    formData.github,
    formData.portfolio,
    formData.achievements
  ];

  const filledCount = _mentorFields.filter(Boolean).length;
  const totalFields = _mentorFields.length;
  const profileCompletion = Math.round(((filledCount / totalFields) * 100));

  const mentorFieldDefs = [
    { key: 'fullName', label: 'Full Name', value: formData.fullName },
    { key: 'email', label: 'Email', value: formData.email },
    { key: 'phone', label: 'Phone', value: formData.phone },
    { key: 'bio', label: 'Bio', value: formData.bio },
    { key: 'tagline', label: 'Tagline', value: formData.tagline },
    { key: 'company', label: 'Company', value: formData.company },
    { key: 'position', label: 'Position', value: formData.position },
    { key: 'yearsOfExperience', label: 'Years of Experience', value: formData.yearsOfExperience },
    { key: 'domain', label: 'Domain', value: formData.domain },
    { key: 'skills', label: 'Skills', value: (formData.skills || []).length > 0 },
    { key: 'expertise', label: 'Expertise', value: (formData.expertise || []).length > 0 },
    { key: 'mentorshipFocus', label: 'Mentorship Focus', value: (formData.mentorshipFocus || []).length > 0 },
    { key: 'teaching_style', label: 'Teaching Style', value: formData.teaching_style },
    { key: 'linkedin', label: 'LinkedIn', value: formData.linkedin },
    { key: 'github', label: 'GitHub', value: formData.github },
    { key: 'portfolio', label: 'Portfolio', value: formData.portfolio },
    { key: 'achievements', label: 'Achievements', value: formData.achievements }
  ];

  const missingFields = mentorFieldDefs.filter(f => !f.value).map(f => f.label);
  const neededToReach75 = Math.max(0, Math.ceil(0.75 * totalFields) - filledCount);
  const suggestedFields = missingFields.slice(0, neededToReach75);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-12 pb-12 px-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-500/40 transition-all duration-300 text-slate-200 font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105"
          >
            <Edit2 className="w-4 h-4" />
            <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden animate-fade-in">
          {/* Cover Header */}
          <div className="h-40 bg-linear-to-r from-green-600 via-teal-600 to-green-600 relative animate-linear-x">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/30" />
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl border-4 border-slate-800">
                  {profileImage ? (
                    <img
                      src={
                        profileImage instanceof File
                          ? URL.createObjectURL(profileImage)
                          : profileImage
                      }
                      alt="Profile"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    userData?.fullName?.charAt(0).toUpperCase() || "M"
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg group-hover:shadow-green-500/50">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <form onSubmit={handleSubmit}>
              
              {/* Personal Information Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl flex items-center justify-center border border-purple-500/30">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Personal Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Full Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Email <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl transition-all duration-300 opacity-50 cursor-not-allowed text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Tagline (Your Expertise Summary)
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      required
                      value={formData.tagline}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="E.g., Full-Stack Developer | React & Node.js expert"
                      maxLength={100}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      required
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder:text-slate-500"
                      placeholder="Tell students about your experience and mentoring approach..."
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl flex items-center justify-center border border-blue-500/30">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Professional Background
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="Your current/latest company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Position/Designation
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="E.g., Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Years of Experience <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="E.g., 5+ years"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Primary Domain <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl flex items-center justify-center border border-green-500/30">
                    <Code className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Skills & Expertise
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Technical Skills{" "}
                      <span className="text-slate-400 font-normal text-xs">
                        (Select all that apply)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-4 rounded-xl bg-slate-900/30 border border-slate-700/50">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            isEditing && handleMultiSelect("skills", skill)
                          }
                          disabled={!isEditing}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                            formData.skills.includes(skill)
                              ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Mentorship Focus Areas{" "}
                      <span className="text-slate-400 font-normal text-xs">
                        (Select all that apply)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-4 rounded-xl bg-slate-900/30 border border-slate-700/50">
                      {mentorshipAreas.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() =>
                            isEditing && handleMultiSelect("mentorshipFocus", area)
                          }
                          disabled={!isEditing}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                            formData.mentorshipFocus.includes(area)
                              ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Teaching Style / Approach
                    </label>
                    <textarea
                      name="teaching_style"
                      value={formData.teaching_style}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder:text-slate-500"
                      placeholder="Describe your teaching philosophy and mentoring approach..."
                    />
                  </div>
                </div>
              </div>

              {/* Mentoring Details Section */}
              {/* <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl flex items-center justify-center border border-orange-500/30">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Mentoring Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Session Duration (Minutes) <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="sessionDuration"
                      value={formData.sessionDuration}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      {sessionDurations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration} minutes
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Hours Available Per Month
                    </label>
                    <input
                      type="number"
                      name="hoursPerMonth"
                      value={formData.hoursPerMonth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="E.g., 8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      <option value="">Select Timezone</option>
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Available Days <span className="text-slate-400 font-normal text-xs">(Select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/30 border border-slate-700/50">
                      {availableDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            isEditing && handleMultiSelect("availability", day)
                          }
                          disabled={!isEditing}
                          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                            formData.availability.includes(day)
                              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Social Links Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl flex items-center justify-center border border-cyan-500/30">
                    <LinkIcon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Social Links
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Portfolio Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl flex items-center justify-center border border-yellow-500/30">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Achievements & Recognition
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Notable Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder:text-slate-500"
                    placeholder="E.g., Helped 100+ students get placed at top companies, Published 5 research papers, etc."
                  />
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-8 border-t border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl bg-slate-700/50 text-slate-200 font-medium hover:bg-slate-600/50 transition-all duration-300 border border-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-green-600 to-teal-600 text-white font-medium shadow-2xl shadow-green-500/50 hover:shadow-green-500/80 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? "Saving..." : "Save Profile"}</span>
                  </button>
                </div>
              )}
            </form>

            {/* Profile Completion Indicator */}
            <div className="mt-8 bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <h3 className="font-bold text-white">Profile Completion</h3>
                </div>
                <span className="text-3xl font-black bg-linear-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-green-600 via-teal-500 to-green-600 transition-all duration-500 rounded-full animate-linear-x"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-3">
                {profileCompletion === 100
                  ? "🎉 Your mentor profile is complete!"
                  : `Complete your profile to start accepting mentorship requests`}
              </p>

              {missingFields.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-300 mb-2">Fields to complete ({missingFields.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {missingFields.map((m) => (
                      <span key={m} className="px-3 py-1 text-xs bg-slate-700/40 text-yellow-300 rounded-md border border-yellow-500/20">
                        {m}
                      </span>
                    ))}
                  </div>

                  {suggestedFields.length > 0 && (
                    <p className="text-sm text-slate-400 mt-3">Suggested to reach 75%: <strong className="text-white">{suggestedFields.join(', ')}</strong></p>
                  )}

                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={() => { setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-medium">Edit Profile</button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

        {/* Mentor Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Users className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Students Mentored</p>
                <p className="text-3xl font-black text-white">--</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
                <Star className="w-7 h-7 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Avg. Rating</p>
                <p className="text-3xl font-black text-white">--</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-black text-white">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
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

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes linear-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-linear-x {
          background-size: 200% 200%;
          animation: linear-x 3s ease infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: linear-linear(to bottom, #9333ea, #ec4899);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: linear-linear(to bottom, #a855f7, #f472b6);
        }
      `}</style>
    </div>
  );
};

export default ProfilePageMentor;