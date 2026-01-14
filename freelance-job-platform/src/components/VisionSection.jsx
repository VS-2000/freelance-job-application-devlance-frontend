import { motion } from "framer-motion";
import { FaRocket, FaBuilding, FaGlobe, FaLightbulb, FaShieldAlt, FaHandshake } from "react-icons/fa";

const VisionSection = () => {
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

    const highlights = [
        {
            icon: <FaRocket className="text-purple-500" />,
            title: "Freelancers",
            desc: "Showcase skills, earn fairly, and build long-term careers"
        },
        {
            icon: <FaBuilding className="text-blue-500" />,
            title: "Clients",
            desc: "Find reliable talent and deliver projects efficiently"
        },
        {
            icon: <FaGlobe className="text-green-500" />,
            title: "Communities",
            desc: "Collaborate globally without limitations"
        }
    ];

    return (
        <section className="py-20 bg-black border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Left Content */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 text-purple-500 text-sm font-bold tracking-wider uppercase mb-6 border border-purple-500/20">
                                <FaLightbulb /> Our Vision
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Building a trusted digital workspace where <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">talent meets opportunity</span> without barriers.
                            </h2>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed">
                            We envision a future where freelancers can grow their careers with confidence, clients can hire skilled professionals effortlessly, and meaningful work happens through transparency, quality, and trust.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800">
                                    <FaShieldAlt className="text-purple-600" />
                                </div>
                                <span className="font-semibold text-sm">Transparency</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center border border-gray-800">
                                    <FaHandshake className="text-purple-600" />
                                </div>
                                <span className="font-semibold text-sm">Trust</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Cards */}
                    <div className="grid gap-6">
                        {highlights.map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="group p-6 bg-gray-900/50 rounded-3xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-black border border-gray-800 flex items-center justify-center group-hover:bg-purple-600/10 group-hover:border-purple-600/30 transition-colors">
                                        <span className="text-2xl">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom Tagline */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-20 pt-10 border-t border-gray-900 text-center"
                >
                    <p className="text-gray-500 italic text-lg max-w-3xl mx-auto">
                        "By combining modern technology with human-centric design, we aim to redefine how freelance work is discovered, managed, and delivered."
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default VisionSection;
