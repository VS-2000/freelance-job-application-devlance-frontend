import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaArrowUp, FaArrowDown, FaHistory, FaUniversity, FaMobileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import API from "../api/axios";
import toast from "react-hot-toast";

const Wallet = () => {
    const [data, setData] = useState({ balance: 0, earnings: [], withdrawals: [] });
    const [loading, setLoading] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawMethod, setWithdrawMethod] = useState("bank"); // bank or upi
    const [details, setDetails] = useState({ accountNumber: "", ifscCode: "", bankName: "", upiId: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const { data } = await API.get("/wallet/data");
            setData(data);
        } catch (err) {
            toast.error("Failed to fetch wallet data");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount || Number(withdrawAmount) < 500) {
            return toast.error("Minimum withdrawal is ₹500");
        }
        if (Number(withdrawAmount) > data.balance) {
            return toast.error("Insufficient balance");
        }

        setSubmitting(true);
        try {
            await API.post("/wallet/withdraw", {
                amount: Number(withdrawAmount),
                method: withdrawMethod,
                details: details
            });
            toast.success("Withdrawal request submitted!");
            setIsWithdrawing(false);
            setWithdrawAmount("");
            fetchWalletData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Withdrawal failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="text-5xl text-purple-500 mb-4"
            >
                <FaWallet />
            </motion.div>
            <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Accessing Secure Vault...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-2 flex items-center gap-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">My Wallet</span>
                            <div className="p-2 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 text-2xl">
                                <FaWallet />
                            </div>
                        </h1>
                        <p className="text-gray-500 font-medium">Manage your hard-earned money and payouts</p>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#111] border border-gray-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group w-full md:w-auto min-w-[300px]"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-600/20 transition-colors"></div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Available Balance</p>
                        <h2 className="text-5xl font-black mb-6">₹{data.balance.toLocaleString()}</h2>
                        <button
                            onClick={() => setIsWithdrawing(true)}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                        >
                            <FaArrowUp /> Withdraw Funds
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Card: Total Earned */}
                    <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                        <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4 border border-green-500/20">
                            <FaArrowDown />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Total Earnings</p>
                        <p className="text-2xl font-black">₹{data.earnings.reduce((sum, e) => sum + (e.amount - (e.commissionAmount || 0)), 0).toLocaleString()}</p>
                    </div>

                    {/* Card: Pending Withdrawals */}
                    <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4 border border-yellow-500/20">
                            <FaClock />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Pending Payouts</p>
                        <p className="text-2xl font-black">₹{data.withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0).toLocaleString()}</p>
                    </div>

                    {/* Card: Recent Transaction */}
                    <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 border border-purple-500/20">
                            <FaHistory />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Last Withdrawal</p>
                        <p className="text-2xl font-black">
                            {data.withdrawals.length > 0 ? `₹${data.withdrawals[0].amount.toLocaleString()}` : "N/A"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Earnings History */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <FaArrowDown className="text-green-500 text-xl" />
                            <h3 className="text-2xl font-black">Recent Earnings</h3>
                        </div>
                        <div className="space-y-4">
                            {data.earnings.length === 0 ? (
                                <div className="p-8 border-2 border-dashed border-gray-800 rounded-3xl text-center text-gray-500">
                                    <p>No earnings recorded yet.</p>
                                </div>
                            ) : (
                                data.earnings.map((earning) => (
                                    <div key={earning._id} className="bg-[#0c0c0c]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between hover:border-gray-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shrink-0">
                                                <FaCheckCircle />
                                            </div>
                                            <div>
                                                <p className="font-bold">{earning.job?.title || "Project Payment"}</p>
                                                <p className="text-xs text-gray-500">{new Date(earning.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right text-green-500">
                                            <p className="font-black">+₹{(earning.amount - (earning.commissionAmount || 0)).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-600 uppercase tracking-tighter">After Commission</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Withdrawal History */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <FaArrowUp className="text-purple-500 text-xl" />
                            <h3 className="text-2xl font-black">Withdrawal Status</h3>
                        </div>
                        <div className="space-y-4">
                            {data.withdrawals.length === 0 ? (
                                <div className="p-8 border-2 border-dashed border-gray-800 rounded-3xl text-center text-gray-500">
                                    <p>No withdrawals initiated yet.</p>
                                </div>
                            ) : (
                                data.withdrawals.map((w) => (
                                    <div key={w._id} className="bg-[#0c0c0c]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between hover:border-gray-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${w.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    w.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {w.status === 'completed' ? <FaCheckCircle /> : w.status === 'failed' ? <FaTimesCircle /> : <FaClock />}
                                            </div>
                                            <div>
                                                <p className="font-bold">Withdrawal via {w.method.toUpperCase()}</p>
                                                <p className="text-xs text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-white">-₹{w.amount.toLocaleString()}</p>
                                            <p className={`text-[10px] uppercase font-bold tracking-widest ${w.status === 'completed' ? 'text-green-500' :
                                                    w.status === 'failed' ? 'text-red-500' :
                                                        'text-yellow-500'
                                                }`}>{w.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Withdrawal Modal */}
            <AnimatePresence>
                {isWithdrawing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsWithdrawing(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#111] border border-gray-800 w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <h2 className="text-3xl font-black mb-2">Request Withdrawal</h2>
                            <p className="text-gray-500 font-medium mb-10">Choose your preferred payout method</p>

                            <form onSubmit={handleWithdraw} className="space-y-8">
                                {/* Amount Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Amount to Withdraw</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-600">₹</span>
                                        <input
                                            type="number"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            placeholder="Min 500"
                                            className="w-full bg-black border-2 border-gray-800 rounded-2xl py-6 pl-14 pr-6 text-2xl font-black focus:border-purple-600 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Method Select */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawMethod("bank")}
                                        className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${withdrawMethod === 'bank' ? 'border-purple-600 bg-purple-600/10' : 'border-gray-800 bg-black hover:border-gray-700'
                                            }`}
                                    >
                                        <FaUniversity className={withdrawMethod === 'bank' ? 'text-purple-400' : 'text-gray-500'} />
                                        <span className="font-bold text-sm">Bank Transfer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawMethod("upi")}
                                        className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${withdrawMethod === 'upi' ? 'border-purple-600 bg-purple-600/10' : 'border-gray-800 bg-black hover:border-gray-700'
                                            }`}
                                    >
                                        <FaMobileAlt className={withdrawMethod === 'upi' ? 'text-purple-400' : 'text-gray-500'} />
                                        <span className="font-bold text-sm">UPI Transfer</span>
                                    </button>
                                </div>

                                {/* Dynamic Fields */}
                                <AnimatePresence mode="wait">
                                    {withdrawMethod === 'bank' ? (
                                        <motion.div
                                            key="bank"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-4"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Bank Name"
                                                value={details.bankName}
                                                onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
                                                className="w-full bg-black border-2 border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none" required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Account Number"
                                                value={details.accountNumber}
                                                onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })}
                                                className="w-full bg-black border-2 border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none" required
                                            />
                                            <input
                                                type="text"
                                                placeholder="IFSC Code"
                                                value={details.ifscCode}
                                                onChange={(e) => setDetails({ ...details, ifscCode: e.target.value })}
                                                className="w-full bg-black border-2 border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none" required
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="upi"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Enter UPI ID (e.g., user@okaxis)"
                                                value={details.upiId}
                                                onChange={(e) => setDetails({ ...details, upiId: e.target.value })}
                                                className="w-full bg-black border-2 border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none" required
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex items-start gap-3">
                                    <FaExclamationTriangle className="text-blue-500 mt-1" />
                                    <p className="text-xs text-blue-200 leading-relaxed font-medium">
                                        Please ensure all details are correct. Transfers to incorrect accounts may not be recoverable.
                                        Payouts normally take 2-3 business days to reflect.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWithdrawing(false)}
                                        className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-gray-800 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] bg-purple-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-purple-900/30 hover:bg-purple-500 transition-all disabled:opacity-50"
                                    >
                                        {submitting ? "Processing Request..." : "Submit Payout Request"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Wallet;
