import { motion } from "framer-motion";
import { FaBullseye, FaEye, FaCheckCircle, FaHeart } from "react-icons/fa";

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-black min-h-screen text-white py-20 px-4 sm:px-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        About <span className="text-purple-600">DevLance</span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Empowering the world's best talent to work on projects that matter.
                    </p>
                </motion.div>

                {/* Mission & Vision Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-900/50 p-10 rounded-3xl border border-gray-800 hover:border-purple-600/50 transition-colors group"
                    >
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                            <FaBullseye size={30} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Our mission is to democratize opportunities for talent worldwide. We aim to break down geographical barriers and connect exceptional developers, designers, and creatives with innovative businesses to build the future together.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="bg-gray-900/50 p-10 rounded-3xl border border-gray-800 hover:border-purple-600/50 transition-colors group"
                    >
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                            <FaEye size={30} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We envision a world where your skill is your only passport. A future where "remote work" is just "work," and where global collaboration is seamless, rewarding, and accessible to everyone with a vision and a drive to succeed.
                        </p>
                    </motion.div>
                </div>

                {/* Why Choose Us Section */}
                <motion.div variants={itemVariants} className="mb-20">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Verified Professionals", desc: "Every user on our platform goes through a rigorous verification process to ensure quality and trust.", icon: <FaCheckCircle /> },
                            { title: "Secure Payments", desc: "Our escrow-based payment system ensures that both clients and freelancers are protected throughout the project.", icon: <FaCheckCircle /> },
                            { title: "Direct Communication", desc: "Instant messaging and collaboration tools keep you connected with your team in real-time.", icon: <FaCheckCircle /> }
                        ].map((item, index) => (
                            <div key={index} className="flex gap-4 p-6 bg-gray-900/30 rounded-2xl border border-gray-800">
                                <div className="text-purple-600 mt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                                    <p className="text-gray-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Closing / Regards Section */}
                <motion.div
                    variants={itemVariants}
                    className="text-center bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-12 rounded-3xl border border-purple-500/20 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <FaHeart className="text-purple-600 mx-auto mb-6" size={40} />
                        <h2 className="text-4xl font-black mb-4">Regards from DevLance</h2>
                        <p className="text-gray-300 text-lg mb-8">
                            Thank you for being part of our journey. We are committed to providing the best platform for your professional growth and project success.
                        </p>
                        <div className="font-bold text-purple-500 tracking-widest uppercase">The DevLance Team</div>
                    </div>
                    {/* Decorative Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/30 blur-[120px] rounded-full"></div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default About;
