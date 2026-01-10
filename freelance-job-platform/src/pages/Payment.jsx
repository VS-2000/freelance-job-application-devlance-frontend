import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaCreditCard, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import API from "../api/axios";
import toast from "react-hot-toast";

const Payment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${jobId}`);
        setJob(data);
      } catch (err) {
        console.error("Failed to fetch job", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate API call delay for realism
      await new Promise(resolve => setTimeout(resolve, 2000));

      await API.post("/payments/simulate", {
        jobId: jobId,
        amount: job.budget
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/job/${jobId}`);
      }, 2000);
    } catch (err) {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading secure gateway...</div>;
  if (!job) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Job details not found.</div>;

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 p-10 rounded-3xl text-center border border-green-900/50 shadow-2xl shadow-green-900/20 max-w-md w-full"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
            <FaCheckCircle className="text-black text-5xl" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-400 font-medium mb-6">Funds have been securely escrowed.</p>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500"
            />
          </div>
          <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest">Redirecting to project...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 md:gap-16 items-start">

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Secure Checkout</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">256-Bit SSL Encrypted</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h2>

            <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
              <div>
                <h4 className="text-xl font-bold mb-1">{job.title}</h4>
                <p className="text-sm text-gray-500">Milestone 1: Project Kickoff</p>
              </div>
              <div className="text-xl font-black text-purple-400">₹{job.budget?.toLocaleString()}</div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>₹{job.budget?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Service Fee (3%)</span>
                <span>₹{(job.budget * 0.03).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-4 border-t border-gray-800 mt-4">
                <span>Total Due</span>
                <span>₹{(job.budget * 1.03).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-900/30 rounded-xl p-4 flex gap-3 items-start">
              <FaLock className="text-purple-400 mt-1 shrink-0" />
              <p className="text-xs text-purple-200 leading-relaxed">
                Your payment is held in <span className="font-bold">escrow</span>. The freelancer is only paid after you approve their submitted work.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full -mr-10 -mt-10 blur-3xl opacity-50"></div>

          <h3 className="text-2xl font-black mb-8 relative z-10">Payment Details</h3>

          <form className="space-y-6 relative z-10" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cardholder Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 font-bold focus:border-purple-600 focus:outline-none transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Card Number</label>
              <div className="relative">
                <FaCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-4 font-bold focus:border-purple-600 focus:outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 font-bold focus:border-purple-600 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">CVC</label>
                <input type="text" placeholder="123" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 font-bold focus:border-purple-600 focus:outline-none transition-all" />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black text-white py-5 rounded-xl font-black text-lg hover:bg-purple-600 transition-all shadow-xl hover:shadow-purple-200 mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {processing ? (
                <>Processing Securely...</>
              ) : (
                <>Pay ₹{(job.budget * 1.03).toLocaleString()}</>
              )}
            </button>

            <div className="flex justify-center gap-4 text-gray-300 text-2xl mt-6 grayscale opacity-50">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
