import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import { FaSearch, FaBriefcase, FaFilter } from "react-icons/fa";
import VisionSection from "../components/VisionSection";


const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();

  const categories = ["Web Dev", "Design", "Writing", "Marketing", "Data Science", "Others"];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/jobs", {
        params: { keyword, category }
      });
      setJobs(data);
    } catch (err) {
      console.error(err);
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
      <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden mb-8 border-b border-gray-800">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 z-10" /> {/* Overlay for readability */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/freelance hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-4 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg"
            >
              Elite Talent. <br />Exceptional Results.
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 font-medium max-w-2xl mx-auto drop-shadow-md">
              The world's leading marketplace for technical talent. Find vetted developers and designers for your next big project.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
              <input
                type="text"
                placeholder="Search for any service (e.g. Web Design)..."
                className="w-full pl-12 pr-32 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:border-purple-500 focus:bg-white/20 focus:outline-none shadow-xl text-white font-medium text-lg placeholder-gray-300 transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors" size={20} />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-purple-600 text-white px-8 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

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
                {categories.map((cat) => (
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
                <span className="text-gray-500 font-medium ml-2">({jobs.length})</span>
              </motion.h2>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-gray-900 rounded-3xl border border-gray-800"></div>
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
                      {(showAll ? jobs : jobs.slice(0, 4)).map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                    {jobs.length > 4 && !showAll && (
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
