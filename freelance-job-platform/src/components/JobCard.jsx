import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaClock, FaTag, FaSignal, FaCheckCircle } from "react-icons/fa";

const JobCard = ({ job }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300 mb-2">
            <FaTag className="mr-1" size={10} /> {job.category || "General"}
          </span>
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-bold text-white group-hover:text-purple-500 transition-colors uppercase tracking-tight"
          >
            {job.title}
          </motion.h3>
        </div>
        <div className="bg-green-900/20 text-green-400 px-4 py-2 rounded-xl font-bold text-lg flex items-center">
          ₹{job.budget}
        </div>
      </div>

      <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed h-12">
        {job.description || "No description provided"}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <FaSignal className="mr-2 text-purple-400" />
          <span className="font-medium">{job.experienceLevel || "Intermediate"}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FaClock className="mr-2 text-purple-400" />
          <span>{new Date(job.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-900/40 flex items-center justify-center text-[10px] font-black text-purple-300 border border-purple-800">
            {job.client?.name?.charAt(0)}
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
              {job.client?.name}
              {job.client?.isVerified && <FaCheckCircle className="text-blue-500 text-[8px]" />}
            </div>
            <div className="text-[8px] text-gray-500 uppercase font-black tracking-widest leading-none">Client</div>
          </div>
        </div>
        <Link
          to={`/job/${job._id}`}
          className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-all duration-300"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
