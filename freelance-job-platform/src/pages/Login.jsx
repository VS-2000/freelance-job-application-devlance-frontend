import { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      setUser(data.data);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-800 rounded-3xl bg-gray-900 shadow-2xl">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-black mb-8 text-white text-center"
      >
        Welcome Back
      </motion.h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full p-4 bg-black border border-gray-800 rounded-xl text-white focus:border-purple-600 focus:outline-none transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-4 bg-black border border-gray-800 rounded-xl text-white focus:border-purple-600 focus:outline-none transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-transform active:scale-95 shadow-lg shadow-purple-900/20">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
