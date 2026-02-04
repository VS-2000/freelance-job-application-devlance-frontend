import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaTag, FaSignal, FaCheckCircle } from "react-icons/fa";

const JobCard = ({ job }) => {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(139,92,246,0.15)] transition-all duration-300 relative group overflow-hidden"
    >
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/5 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300 mb-2 border border-purple-800/30">
              <FaTag className="mr-1" size={10} /> {job.category || "General"}
            </span>
            <h3
              className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight leading-tight"
            >
              {job.title}
            </h3>
          </div>
          <div className="bg-green-900/20 text-green-400 px-4 py-2 rounded-xl font-bold text-lg flex items-center whitespace-nowrap border border-green-900/30">
            ₹{job.budget?.toLocaleString()}
          </div>
        </div>

        <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed h-12">
          {job.description || "No description provided"}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
              <FaSignal className="text-purple-400" size={12} />
            </div>
            <span className="font-medium">{job.experienceLevel || "Intermediate"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3 border border-gray-700">
              <FaClock className="text-purple-400" size={12} />
            </div>
            <span>{new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-[11px] font-black text-white border-2 border-gray-900 shadow-xl shadow-purple-900/40">
              {job.client?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="text-[10px] font-bold text-white flex items-center gap-1">
                {job.client?.name}
                {job.client?.isVerified && <FaCheckCircle className="text-blue-500 text-[8px]" />}
              </div>
              <div className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none">Elite Client</div>
            </div>
          </div>
          <Link
            to={`/job/${job._id}`}
            className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-xs hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg shadow-black/20 uppercase tracking-widest"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
