import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, MessageSquare, Users, HelpCircle, 
  FileText, Award, Settings, Bell, User, ChevronDown,
  BookOpen, LogOut
} from 'lucide-react';
import axios from 'axios';
import { serverUrl } from '../App';
import { addUserData } from '../Redux/userSlice';

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const userData = useSelector((state) => state.user?.userData);
  const role = userData?.role;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const studentNavItems = [
    { name: 'Mentors', path: '/user/mentors', icon: Users },
    { name: 'Ask Question', path: '/user/ask-question', icon: HelpCircle },
    { name: 'My Queries', path: '/user/queries', icon: FileText },
    { name: 'Messages', path: '/user/messages', icon: MessageSquare, badge: 3 },
    { name: 'Resources', path: '/user/resources', icon: BookOpen }
  ];

  const mentorNavItems = [
    { name: 'Requests', path: '/mentor/requests', icon: FileText, badge: 5 },
    { name: 'Active Chats', path: '/mentor/chats', icon: MessageSquare },
    { name: 'My Rank', path: '/mentor/rank', icon: Award },
    { name: 'Guidelines', path: '/mentor/guidelines', icon: BookOpen }
  ];

  const navItems = role === 'mentor' ? mentorNavItems : studentNavItems;
  const isActive = (path) => location.pathname === path;

  const handleLogout = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {withCredentials: true});
      dispatch(addUserData(null));
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border-b border-purple-500/20' 
          : 'bg-slate-900/60 backdrop-blur-xl border-b border-purple-500/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className="flex flex-col group transition-transform duration-300 hover:scale-105"
            >
              <div  className="flex items-baseline relative">
                <span className="text-2xl font-black bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text animate-linear-x">
                  UpNext
                </span>
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
              </div>
              <p className="text-xs text-purple-300/60 font-medium tracking-wider ml-0.5 mt-0.5">
                From Campus to Career
              </p>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative group flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      active
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${
                      active ? '' : 'group-hover:scale-110'
                    }`} />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {!active && (
                      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              
              {/* Notifications Button */}
              <button className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800/50 text-purple-300 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 border border-purple-500/20">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-linear-to-r from-pink-500 to-pink-600 items-center justify-center text-white text-xs font-bold shadow-lg shadow-pink-500/50">
                    3
                  </span>
                </span>
              </button>

              {/* Profile Dropdown - Desktop */}
              <div className="relative hidden sm:block" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border border-purple-500/20 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-200 text-sm max-w-25 truncate">
                    {userData?.fullName || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    showProfileDropdown ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden animate-slideDown">
                    {/* Dropdown Header */}
                    <div className="p-5 bg-linear-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-lg truncate">{userData?.fullName || 'User'}</p>
                          <p className="text-purple-100 text-sm capitalize">{role || 'Student'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    <div className="p-2">
                      {userData.role=="student"? <Link
                        to="/profile"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">View Profile</span>
                      </Link>:<Link
                        to="/profilementor"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">View Profile</span>
                      </Link>}
                     
                      
                      <Link
                        to="/settings"
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                      >
                        <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Settings</span>
                      </Link>
                      <div className="my-2 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-800/95 backdrop-blur-xl border-t border-purple-500/20 shadow-xl animate-slideDown max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Profile Info */}
              <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-md">
                  {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="relative">
                  <p className="font-bold text-white">{userData?.fullName || 'User'}</p>
                  <p className="text-sm text-purple-100 capitalize">{role || 'Student'}</p>
                </div>
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                      active
                        ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-linear-to-r from-pink-500 to-pink-600 rounded-full shadow-lg shadow-pink-500/50">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="my-4 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent"></div>

              {/* Mobile Profile Links */}
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>View Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white font-medium transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              
              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-all duration-300 border-2 border-red-500/20 hover:border-red-500/40 mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes linear-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-linear-x {
          background-size: 200% 200%;
          animation: linear-x 3s ease infinite;
        }
      `}</style>
    </>
  );
};

export default NavBar;