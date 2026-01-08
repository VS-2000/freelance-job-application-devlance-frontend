import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { FaStar } from "react-icons/fa";

const Reviews = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/ reviews / ${userId} `);
        setReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews");
      }
    };
    fetchReviews();
  }, [userId]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-black mb-8 flex items-center gap-3"
        >
          <span className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-lg">⭐</span>
          User Reviews
          {reviews.length > 0 && (
            <span className="text-lg font-normal text-gray-400">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          )}
        </motion.h2>

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < r.rating ? "text-yellow-500" : "text-gray-700"} />
                      ))}
                    </span>
                    <span className="text-gray-500 text-xs font-bold bg-gray-800 px-2 py-1 rounded">{r.rating}.0</span>
                  </div>
                  {r.reviewer && (
                    <span className="text-sm text-purple-400 font-semibold">
                      by {r.reviewer.name}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 italic mb-2">"{r.comment}"</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest text-right">Verified Review</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
              No reviews found for this user.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
