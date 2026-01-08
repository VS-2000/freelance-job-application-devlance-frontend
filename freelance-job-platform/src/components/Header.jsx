import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaEnvelope, FaSignOutAlt, FaRocket, FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";

const Header = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && !user.isVerified) {
      refreshUser();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
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
          {user ? (
            <>
              <NavLink to="/" end className={navLinkClass}>Explore Jobs</NavLink>
              <NavLink to="/about" className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>

              {user.role?.toLowerCase() === "client" && (
                <NavLink to="/post-job" className={navLinkClass}>
                  <span className="hidden sm:inline">Post a Job</span>
                </NavLink>
              )}

              <NavLink to="/messages" className={navLinkClass}>
                <FaEnvelope size={16} /> <span className="hidden sm:inline">Messages</span>
              </NavLink>

              {user.role?.toLowerCase() === "admin" && (
                <NavLink to="/admin" className={({ isActive }) =>
                  `text-sm font-bold px-3 py-1 rounded-lg transition-all ${isActive ? 'bg-purple-600 text-white' : 'text-purple-600 bg-purple-50 hover:bg-purple-100'
                  }`
                }>Admin Panel</NavLink>
              )}

              <div className="h-8 w-[1px] bg-gray-100 hidden sm:block"></div>

              <div className="flex items-center gap-2 md:gap-4">
                <Link to={`/profile/${user._id}`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-black group-hover:bg-purple-600 group-hover:text-white transition-all">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <div className="text-[10px] md:text-sm font-bold text-gray-200 flex items-center gap-1">
                      {user.name}
                      {user.isVerified && <FaCheckCircle className="text-blue-500 text-[10px]" />}
                    </div>
                    <div className="text-[8px] md:text-[10px] font-black uppercase text-purple-500 tracking-widest leading-none">{user.role}</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">About</Link>
              <Link to="/contact" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">Contact</Link>
              <Link to="/login" className="text-white font-bold text-sm px-4 hover:text-purple-500 transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg shadow-gray-800">
                Join Now
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
