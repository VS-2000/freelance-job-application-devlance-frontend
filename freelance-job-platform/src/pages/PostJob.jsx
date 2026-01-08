import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaRocket, FaCalendarAlt, FaBriefcase, FaLayerGroup, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Web Dev",
    experienceLevel: "Intermediate",
    deadline: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isVerified) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role?.toLowerCase() !== "client" && user.role?.toLowerCase() !== "admin") {
        toast.error("Unauthorized access.");
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const categories = ["Web Dev", "Design", "Writing", "Marketing", "Data Science", "Others"];
  const levels = ["Entry", "Intermediate", "Expert"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.description.trim()) newErrors.description = "Please provide a description";
    if (!formData.budget || formData.budget <= 0) newErrors.budget = "Valid budget is required";
    if (!formData.deadline) newErrors.deadline = "Deadline is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.post("/jobs", {
        ...formData,
        budget: Number(formData.budget)
      });
      toast.success("Job posted successfully!");
      setShowSuccess(true);
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 relative">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 p-10 rounded-[32px] text-center max-w-sm w-full shadow-2xl shadow-purple-900/40"
            >
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/40">
                <FaCheckCircle className="text-white text-4xl" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Project Posted!</h3>
              <p className="text-gray-400 mb-6">Your project is now live. Get ready for proposals from top talent.</p>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5 }}
                  className="h-full bg-purple-600"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-[40px] shadow-2xl shadow-purple-900/10 overflow-hidden border border-gray-800">
          <div className="bg-black p-10 text-white relative overflow-hidden border-b border-gray-800">
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-black mb-2 flex items-center gap-3"
              >
                <FaRocket className="text-purple-400" /> Post a New Project
              </motion.h2>
              <p className="text-gray-400 font-medium">Reach the world's best technical talent on Dev Lance.</p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          </div>

          {!user?.isVerified && (
            <div className="bg-red-900/10 border-b border-red-900/20 p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center shrink-0">
                <FaExclamationCircle className="text-red-500 text-xl" />
              </div>
              <div>
                <h4 className="text-red-500 font-black uppercase text-xs tracking-widest mb-1">Account Verification Required</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  Your account must be manually verified by our team before you can post your first project. This ensures a safe and professional environment for all members.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={submitHandler} className={`p-10 space-y-8 ${!user?.isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Project Title</label>
                <input
                  name="title"
                  className={`w-full bg-black border-2 ${errors.title ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-purple-600'} rounded-2xl p-4 text-white font-bold focus:outline-none transition-all placeholder:text-gray-700`}
                  placeholder="e.g. Build a Modern Landing Page with Tailwind"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><FaExclamationCircle /> {errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</label>
                <textarea
                  name="description"
                  className={`w-full bg-black border-2 ${errors.description ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-purple-600'} rounded-2xl p-4 text-white font-medium focus:outline-none transition-all placeholder:text-gray-700 min-h-[150px]`}
                  placeholder="Describe the goals, tech stack, and deliverables..."
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><FaExclamationCircle /> {errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaLayerGroup className="text-purple-400" /> Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-purple-600 focus:outline-none transition-all appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {categories.map(c => <option key={c} value={c} className="bg-gray-900 py-2">{c}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaBriefcase className="text-purple-400" /> Experience Level
                  </label>
                  <div className="relative">
                    <select
                      name="experienceLevel"
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-purple-600 focus:outline-none transition-all appearance-none cursor-pointer"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                    >
                      {levels.map(l => <option key={l} value={l} className="bg-gray-900 py-2">{l}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs">▼</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Project Budget (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-purple-600">₹</span>
                    <input
                      name="budget"
                      type="number"
                      className={`w-full bg-black border-2 ${errors.budget ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-purple-600'} rounded-2xl pl-10 pr-4 py-4 text-white font-black focus:outline-none transition-all placeholder:text-gray-700`}
                      placeholder="5000"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.budget && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><FaExclamationCircle /> {errors.budget}</p>}
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-purple-400" /> Submission Deadline
                  </label>
                  <input
                    name="deadline"
                    type="date"
                    className={`w-full bg-black border-2 ${errors.deadline ? 'border-red-500/50 focus:border-red-500' : 'border-gray-800 focus:border-purple-600'} rounded-2xl p-4 text-white font-bold focus:outline-none transition-all [color-scheme:dark]`}
                    value={formData.deadline}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.deadline && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><FaExclamationCircle /> {errors.deadline}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-black transition-all shadow-xl shadow-purple-900/20 disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none relative overflow-hidden group"
            >
              <span className={`relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}>Publish Project to Dev Lance</span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
