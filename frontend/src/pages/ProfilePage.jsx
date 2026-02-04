
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
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
} from "lucide-react";
import axios from "axios";
import { serverUrl } from "../App";
import { addUserData } from "../Redux/userSlice";

const ProfilePage = () => {
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
    college: "",
    branch: "",
    year: "",
    rollNumber: "",
    cgpa: "",
    domain: "",
    skills: [],
    interests: [],
    experience: "",
    github: "",
    linkedin: "",
    portfolio: "",
    careerGoal: "",
    lookingFor: [],
  });

  // Pre-defined options
  const branches = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
    "Other",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

  const domains = [
    "Web Development",
    "Mobile App Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Deep Learning",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "Blockchain",
    "Internet of Things (IoT)",
    "Game Development",
    "UI/UX Design",
    "Product Management",
    "Business Analytics",
    "Data Engineering",
    "Robotics",
    "AR/VR",
    "Embedded Systems",
    "Software Testing / QA",
    "System Design",
    "Salesforce",
    "Digital Marketing",
    "Other",
  ];

  const skillOptions = [
    "JavaScript", "Python", "Java", "C", "C++", "Go", "Rust", "TypeScript",
    "Swift", "Kotlin", "Dart", "HTML", "CSS", "React", "Next.js", "Angular",
    "Vue.js", "Tailwind CSS", "Bootstrap", "Node.js", "Express.js", "Django",
    "Flask", "Spring Boot", "FastAPI", "Flutter", "React Native", "MongoDB",
    "MySQL", "PostgreSQL", "Firebase", "Redis", "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "CI/CD", "Linux", "Nginx", "Machine Learning",
    "Deep Learning", "TensorFlow", "PyTorch", "OpenCV", "NLP", "Git",
    "GitHub", "Postman", "Figma", "Jira", "Jest", "Mocha", "Cypress",
    "System Design", "REST APIs", "GraphQL",
  ];

  const interestOptions = [
    "Open Source", "Hackathons", "Competitive Programming", "Research & Publications",
    "System Design", "AI & ML", "Web Development", "Mobile App Development",
    "Internships", "Freelancing", "Startups", "Entrepreneurship", "Product Management",
    "Career Guidance", "Higher Studies (MS / MTech / MBA)", "Study Abroad",
    "GATE", "UPSC", "SSC", "Bank Exams", "Railway Exams", "State Government Exams",
    "Defense Exams (NDA/CDS/AFCAT)", "Public Speaking", "Teaching / Mentoring",
    "Content Creation", "Blogging", "Networking", "Leadership", "Personal Branding",
    "Volunteering", "Social Work", "Other",
  ];

  const lookingForOptions = [
    "Internship", "Full-time Job", "Freelance Work", "Mentorship",
    "Project Collaboration", "Research Opportunities", "Career Guidance",
  ];

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        location: userData.location || "",
        bio: userData.bio || "",
        college: userData.college || "",
        branch: userData.branch || "",
        year: userData.year || "",
        rollNumber: userData.rollNumber || "",
        cgpa: userData.cgpa || "",
        domain: userData.domain || "",
        skills: userData.skills || [],
        interests: userData.interests || [],
        experience: userData.experience || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        portfolio: userData.portfolio || "",
        careerGoal: userData.careerGoal || "",
        lookingFor: userData.lookingFor || [],
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
      const data = new FormData();
      formData["profileCompletion"]=profileCompletion
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(file);
  };

  const profileCompletion = Math.round(
    (((formData.fullName ? 1 : 0) +
      (formData.email ? 1 : 0) +
      (formData.college ? 1 : 0) +
      (formData.branch ? 1 : 0) +
      (formData.year ? 1 : 0) +
      (formData.domain ? 1 : 0) +
      (formData.skills.length > 0 ? 1 : 0) +
      (formData.bio ? 1 : 0)) / 8) * 100
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 pt-12 pb-12 px-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-linear(rgba(147,51,234,0.03)_1px,transparent_1px),linear-linear(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
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
          <div className="h-40 bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 relative animate-linear-x">
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-slate-900/30" />
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-black text-5xl shadow-2xl border-4 border-slate-800">
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
                    userData?.fullName?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg group-hover:shadow-purple-500/50">
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
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder:text-slate-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Continue in next part... */}

              {/* Academic Information Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl flex items-center justify-center border border-blue-500/30">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Academic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      College/University <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="Enter your college name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Branch/Department <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Year <span className="text-pink-400">*</span>
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="Your roll number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      CGPA/Percentage
                    </label>
                    <input
                      type="text"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder:text-slate-500"
                      placeholder="e.g., 8.5 or 85%"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl flex items-center justify-center border border-pink-500/30">
                    <Briefcase className="w-5 h-5 text-pink-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Professional Information
                  </h2>
                </div>

                <div className="space-y-6">
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Skills{" "}
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
                              ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
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
                      Interests{" "}
                      <span className="text-slate-400 font-normal text-xs">
                        (Select all that apply)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-4 rounded-xl bg-slate-900/30 border border-slate-700/50">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() =>
                            isEditing &&
                            handleMultiSelect("interests", interest)
                          }
                          disabled={!isEditing}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                            formData.interests.includes(interest)
                              ? "bg-linear-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    >
                      <option value="">Select Experience</option>
                      <option value="Beginner">Beginner (0-1 years)</option>
                      <option value="Intermediate">
                        Intermediate (1-2 years)
                      </option>
                      <option value="Advanced">Advanced (2+ years)</option>
                    </select>
                  </div>
                </div>
              </div>

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

              {/* Career Goals Section */}
              <div className="mb-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl flex items-center justify-center border border-amber-500/30">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Career Goals
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Career Goal
                    </label>
                    <textarea
                      name="careerGoal"
                      value={formData.careerGoal}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder:text-slate-500"
                      placeholder="Describe your career aspirations and goals..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Currently Looking For{" "}
                      <span className="text-slate-400 font-normal text-xs">
                        (Select all that apply)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {lookingForOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            isEditing && handleMultiSelect("lookingFor", option)
                          }
                          disabled={!isEditing}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                            formData.lookingFor.includes(option)
                              ? "bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                              : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"
                          } ${!isEditing ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
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
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>{loading ? "Saving..." : "Save Profile"}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-8 bg-slate-800/40 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-500/20 p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white">Profile Completion</h3>
            </div>
            <span className="text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {profileCompletion}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 transition-all duration-500 rounded-full animate-linear-x"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-3">
            {profileCompletion === 100 
              ? "🎉 Your profile is complete!" 
              : `Complete your profile to get better mentor matches`}
          </p>
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

        /* Custom Scrollbar */
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

export default ProfilePage;