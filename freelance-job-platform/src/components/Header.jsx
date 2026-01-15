import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaEnvelope, FaSignOutAlt, FaRocket, FaCheckCircle, FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !user.isVerified) {
      refreshUser();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-bold transition-colors flex items-center gap-2 ${isActive ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'
    }`;

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="w-full px-4 md:px-10 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200 group-hover:rotate-12 transition-transform">
            <FaRocket size={18} />
          </div>
          <span className="font-black text-2xl text-white tracking-tight">Dev<span className="text-purple-600">Lance</span></span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <>
                <NavLink to="/" end className={navLinkClass}>Explore Jobs</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>

                {user.role?.toLowerCase() === "client" && (
                  <NavLink to="/post-job" className={navLinkClass}>
                    Post a Job
                  </NavLink>
                )}

                {user.role?.toLowerCase() === "freelancer" && (
                  <NavLink to="/wallet" className={navLinkClass}>
                    Wallet
                  </NavLink>
                )}

                <NavLink to="/messages" className={navLinkClass}>
                  <FaEnvelope size={16} /> Messages
                </NavLink>

                {user.role?.toLowerCase() === "admin" && (
                  <NavLink to="/admin" className={({ isActive }) =>
                    `text-sm font-bold px-3 py-1 rounded-lg transition-all ${isActive ? 'bg-purple-600 text-white' : 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                    }`
                  }>Admin Panel</NavLink>
                )}
              </>
            ) : (
              <>
                <Link to="/about" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">About</Link>
                <Link to="/contact" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">Contact</Link>
                <Link to="/login" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">Login</Link>
              </>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to={`/profile/${user._id}`} className="flex items-center gap-2 md:gap-3 group">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-black group-hover:bg-purple-600 group-hover:text-white transition-all overflow-hidden">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0)
                  )}
                </div>
                <div className="hidden sm:flex flex-col">
                  <div className="text-[10px] md:text-sm font-bold text-gray-200 flex items-center gap-1">
                    {user.name}
                    {user.isVerified && <FaCheckCircle className="text-blue-500 text-[10px]" />}
                  </div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase text-purple-500 tracking-widest leading-none">{user.role}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden lg:block p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          ) : (
            <Link to="/register" className="hidden lg:block bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg shadow-gray-800">
              Join Now
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-64 bg-gray-900 z-50 shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400">
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col p-6 space-y-6">
              {user ? (
                <>
                  <div className="border-b border-gray-800 pb-6 mb-2">
                    <Link to={`/profile/${user._id}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-black overflow-hidden">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="text-white font-bold">{user.name}</div>
                        <div className="text-xs text-purple-500 font-bold uppercase">{user.role}</div>
                      </div>
                    </Link>
                  </div>
                  <NavLink to="/" end className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Explore Jobs</NavLink>
                  <NavLink to="/messages" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Messages</NavLink>
                  {user.role?.toLowerCase() === "client" && (
                    <NavLink to="/post-job" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Post a Job</NavLink>
                  )}
                  {user.role?.toLowerCase() === "freelancer" && (
                    <NavLink to="/wallet" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Wallet</NavLink>
                  )}
                  {user.role?.toLowerCase() === "admin" && (
                    <NavLink to="/admin" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</NavLink>
                  )}
                  <NavLink to="/about" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                  <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 font-bold text-sm pt-4 border-t border-gray-800"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/about" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
                  <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white font-bold text-sm">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-purple-600 text-white text-center py-3 rounded-xl font-bold text-sm">Join Now</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
