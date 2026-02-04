import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import { FaSearch, FaBriefcase, FaFilter } from "react-icons/fa";
import JobCardSkeleton from "../components/JobCardSkeleton";
import VisionSection from "../components/VisionSection";
import BrandTicker from "../components/BrandTicker";


const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const categories = ["Web Dev", "Design", "Writing", "Marketing", "Data Science", "Others"];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/jobs", {
        params: { keyword, category }
      });
      // Handle potential wrapped data or direct array
      const jobsArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
      setJobs(jobsArray);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category]); // Re-fetch on category change

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      {/* Hero Section */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[700px] flex items-center justify-center overflow-hidden mb-8 border-b border-gray-800 perspective-1000"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/75 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/freelance hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content with 3D Tilt */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative z-10 w-full px-4 md:px-10"
        >
          <div className="max-w-4xl mx-auto text-center" style={{ transform: "translateZ(50px)" }}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl"
            >
              Elite Talent. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                Exceptional Results.
              </span>
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 font-medium max-w-2xl mx-auto drop-shadow-md">
              The world's leading marketplace for technical talent. Find vetted developers and designers for your next big project.
            </p>

            {/* Search Bar with its own subtle lift */}
            <motion.form
              onSubmit={handleSearch}
              style={{ transform: "translateZ(30px)" }}
              className="relative max-w-2xl mx-auto group"
            >
              <input
                type="text"
                placeholder="Search for any service (e.g. Web Design)..."
                className="w-full pl-12 pr-32 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] focus:border-purple-500/50 focus:bg-white/10 focus:outline-none shadow-2xl text-white font-medium text-lg placeholder-gray-500 transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              <button
                type="submit"
                className="absolute right-3 top-3 bottom-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-purple-900/40"
              >
                Search
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
      <BrandTicker />

      <div className="w-full px-4 md:px-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-gray-900 border border-gray-800 text-white font-bold py-3 rounded-xl mb-4"
          >
            <FaFilter className="text-purple-500" /> {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Sidebar / Filters */}
          <aside className={`lg:w-64 space-y-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div>
              <div className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                <FaFilter className="mr-2 text-purple-500" /> Filters
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!category ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                >
                  All Categories
                </button>
                {(categories || []).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all ${category === cat ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {user?.role?.toLowerCase() === "client" && (
              <div className="p-6 bg-gray-900 rounded-3xl text-white shadow-2xl border border-gray-800">
                <h4 className="text-xl font-bold mb-2">Need work done?</h4>
                <p className="text-gray-400 text-sm mb-6">Post a job and receive proposals from top talent within minutes.</p>
                <Link
                  to="/post-job"
                  className="block text-center bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                >
                  Post New Job
                </Link>
              </div>
            )}
          </aside>

          {/* Job List */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                {category ? `${category} Jobs` : "Available Opportunities"}
                <span className="text-gray-500 font-medium ml-2">({(Array.isArray(jobs) ? jobs.length : 0)})</span>
              </motion.h2>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="bg-gray-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-800">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaSearch className="text-gray-500" size={24} />
                    </div>
                    <motion.h3
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-xl font-bold text-white mb-2"
                    >
                      No jobs found
                    </motion.h3>
                    <p className="text-gray-500">Try adjusting your search or filters to find more results.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      {(Array.isArray(jobs) ? (showAll ? jobs : jobs.slice(0, 4)) : []).map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                    {Array.isArray(jobs) && jobs.length > 4 && !showAll && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={() => setShowAll(true)}
                          className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 transition-all transform hover:scale-105"
                        >
                          Show More Opportunities
                        </button>
                      </div>
                    )}
                    {showAll && (
                      <div className="mt-12 text-center">
                        <button
                          onClick={() => setShowAll(false)}
                          className="px-10 py-4 bg-gray-900 border border-gray-800 hover:border-purple-600 text-white font-black rounded-2xl transition-all"
                        >
                          Show Less
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <VisionSection />
    </div>
  );
};

export default Dashboard;
