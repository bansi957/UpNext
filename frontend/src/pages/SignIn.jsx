

import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useDispatch } from "react-redux";
import { addUserData } from "../Redux/UserSlice";
import { Sparkles, GraduationCap, Users, MessageCircle, ArrowRight, Zap } from "lucide-react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter all details before signin");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setError("");
      console.log(result);
      dispatch(addUserData(result.data.user));
    } catch (err) {
      setError(err.response?.data.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result1 = await signInWithPopup(auth, provider);

      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        { email: result1.user.email },
        { withCredentials: true }
      );
      setError("");
      console.log(result);
      dispatch(addUserData(result.data.user));
    } catch (err) {
      setError(err.response?.data.message || err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      {/* LEFT - BRAND SECTION */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 min-h-[50vh] lg:min-h-screen">
        <div className="relative z-10 w-full max-w-lg animate-fade-in">
          {/* Logo Section */}
          <div className="mb-6">
            <div className="flex items-baseline mb-4">
              <span className="text-4xl lg:text-5xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-gradient-x">
                UpNext
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-1 w-12 bg-linear-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <p className="text-lg lg:text-xl text-white/90 font-bold">
                From <span className="text-purple-400">Campus</span> to <span className="text-pink-400">Career</span>
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-2">
            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">Real-World Guidance</h3>
                  <p className="text-slate-300 text-xs">Connect with experienced professionals</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">Industry Experience</h3>
                  <p className="text-slate-300 text-xs">Learn from mentors in top companies</p>
                </div>
              </div>
            </div>

            <div className="group bg-slate-800/40 backdrop-blur-xl rounded-lg p-3 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-0.5">1-on-1 Conversations</h3>
                  <p className="text-slate-300 text-xs">Personalized guidance for your goals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-4 flex items-center space-x-2 text-purple-300/60 text-xs">
            <Sparkles className="w-4 h-4" />
            <span>Join 10,000+ students and mentors</span>
          </div>
        </div>
      </div>

      {/* RIGHT - FORM SECTION */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md animate-slide-up">
          {/* Header */}
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg mb-2 shadow-2xl shadow-purple-500/50 animate-float">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-1">
              Welcome Back!
            </h2>
            <p className="text-slate-300 text-sm">
              Sign in to continue your journey with UpNext
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Email Address
              </label>
              <input
                value={email}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading || googleLoading}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-white placeholder:text-slate-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={loading || googleLoading}
                  className="w-full px-3 py-2 pr-10 rounded-lg border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl focus:border-purple-500 focus:outline-none transition-all duration-200 text-white placeholder:text-slate-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-2 bg-red-500/10 border-2 border-red-500/30 rounded-lg animate-shake backdrop-blur-xl">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-xs text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-2 rounded-lg font-bold text-sm text-white bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
            <span className="px-2 text-xs font-medium text-slate-400">OR</span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 border-2 border-slate-700 bg-slate-800/50 backdrop-blur-xl rounded-lg font-semibold text-xs text-slate-200 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                />
                <span>Sign in</span>
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <p className="mt-2 text-center text-slate-300 text-xs">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all"
            >
              Sign Up
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

export default SignIn;