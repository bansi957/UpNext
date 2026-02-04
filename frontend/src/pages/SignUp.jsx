
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { addUserData } from "../Redux/userSlice";
import { Sparkles, GraduationCap, Users, MessageCircle, ArrowRight, UserCircle, Award } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, role },
        { withCredentials: true }
      );
      setError("");
      console.log(result);
      dispatch(addUserData(result.data.user ?? result.data));
    } catch (err) {
      setError(err.response?.data.message || err.message);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result1 = await signInWithPopup(auth, provider);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        { fullName: result1.user.displayName, email: result1.user.email, role },
        { withCredentials: true }
      );
      setError("");
      console.log(result);
      dispatch(addUserData(result.data.user ?? result.data));
    } catch (err) {
      setError(err.response?.data.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      {/* LEFT - BRAND SECTION */}
      <div className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen flex items-center justify-center p-8 lg:p-16">
        <div className="relative z-10 w-full max-w-lg animate-fade-in">
          {/* Logo Section */}
          <div className="mb-12">
            <div className="flex items-baseline mb-4">
              <span className="text-6xl lg:text-8xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                UpNext
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-1 w-16 bg-linear-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <p className="text-2xl lg:text-3xl text-white/90 font-bold">
                From <span className="text-purple-400">Campus</span> to <span className="text-pink-400">Career</span>
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Real-World Guidance</h3>
                  <p className="text-slate-300 text-sm">Connect with experienced professionals</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Industry Experience</h3>
                  <p className="text-slate-300 text-sm">Learn from mentors in top companies</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-2xl p-5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">1-on-1 Conversations</h3>
                  <p className="text-slate-300 text-sm">Personalized guidance for your goals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-12 flex items-center space-x-2 text-purple-300/60 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Join 10,000+ students and mentors</span>
          </div>
        </div>
      </div>

      {/* RIGHT - FORM SECTION */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-2xl shadow-purple-500/50 animate-float">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-2">
              Create Your Account
            </h2>
            <p className="text-slate-300 text-lg">
              Start your journey with UpNext today
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-200 mb-3">
              Choose Your Role
            </label>
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-1 flex border-2 border-slate-700">
              {/* Sliding Background */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-linear-to-r rounded-lg shadow-lg transition-all duration-300 ${
                  role === "student"
                    ? "left-1 from-purple-600 to-pink-600 shadow-purple-500/50"
                    : "left-[calc(50%+4px-1px)] from-purple-600 to-pink-600 shadow-purple-500/50"
                }`}
              ></div>

              {/* Student Button */}
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`relative z-10 flex-1 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  role === "student" ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span>Student</span>
              </button>

              {/* Mentor Button */}
              <button
                type="button"
                onClick={() => setRole("mentor")}
                className={`relative z-10 flex-1 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  role === "mentor" ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Award className="w-5 h-5" />
                <span>Mentor</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                type="text"
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-white placeholder:text-slate-500"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Email Address
              </label>
              <input
                value={email}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-white placeholder:text-slate-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-white placeholder:text-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl animate-shake backdrop-blur-xl">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group mt-6"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="px-4 text-sm font-medium text-slate-400">OR</span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center space-x-3 py-4 px-4 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl rounded-xl font-semibold text-slate-200 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span>Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-slate-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all"
            >
              Sign In
            </a>
          </p>
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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
          animation: slide-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
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
      `}</style>
    </div>
  );
};

export default SignUp;