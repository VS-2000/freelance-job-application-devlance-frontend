import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [myMessages, setMyMessages] = useState([]);

    useEffect(() => {
        if (user?.email) {
            fetchMyMessages();
        }
    }, [user]);

    const fetchMyMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/contact/my-messages?email=${user.email}`);
            setMyMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/contact", formData);
            toast.success(response.data.message);
            setFormData({ name: "", email: "", message: "" });
            if (user?.email) {
                fetchMyMessages();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white py-20 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Contact <span className="text-purple-600">Us</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Have questions or suggestions? We'd love to hear from you.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Admin Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-8">Admin Contact Details</h2>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <FaEnvelope size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">Email Us</div>
                                    <div className="text-xl font-bold">vishnusudar32@gmail.com</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <FaPhone size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">Call Us</div>
                                    <div className="text-xl font-bold">+91 9061197109</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                    <FaMapMarkerAlt size={24} />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">Our Office</div>
                                    <div className="text-xl font-bold">India, Kerala </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media or Additional Info */}
                        <div className="mt-12 p-8 bg-gray-900/40 rounded-3xl border border-gray-800">
                            <h3 className="font-bold text-xl mb-4 text-purple-600">Response Time</h3>
                            <p className="text-gray-400">
                                Our support team is available Monday to Friday, 9:00 AM to 6:00 PM . We typically respond to all inquiries within 24 hours.
                            </p>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-900/50 p-8 md:p-10 rounded-[2.5rem] border border-gray-800 relative overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 ml-1">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-600 transition-colors text-white"
                                    placeholder="Name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-600 transition-colors text-white"
                                    placeholder="email@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400 ml-1">Your Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full bg-black border border-gray-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-purple-600 transition-colors text-white resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : (
                                    <>
                                        Send Message <FaPaperPlane />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Background Glow */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full"></div>
                    </motion.div>
                </div>

                {/* Admin Responses Section */}
                {user && myMessages.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <FaCheckCircle className="text-green-500" />
                            Admin Responses
                        </h2>
                        <div className="space-y-6">
                            {myMessages.map((msg) => (
                                <div key={msg._id} className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 space-y-6">
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Your Message</div>
                                        <p className="text-gray-400 italic">"{msg.message}"</p>
                                        <div className="text-xs text-gray-600 mt-2">Sent on {new Date(msg.createdAt).toLocaleDateString()}</div>
                                    </div>

                                    <div className="border-t border-gray-800 pt-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                                <FaEnvelope className="text-white text-sm" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-purple-400">Admin Response</div>
                                                <div className="text-xs text-gray-600">
                                                    {new Date(msg.adminResponse.respondedAt).toLocaleDateString()} at {new Date(msg.adminResponse.respondedAt).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 border border-purple-900/30 rounded-2xl p-6">
                                            <p className="text-white leading-relaxed">{msg.adminResponse.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Contact;
