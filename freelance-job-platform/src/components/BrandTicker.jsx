import { motion } from "framer-motion";

const BrandTicker = () => {
    const skills = [
        "React.js", "Node.js", "Python", "UI/UX Design", "Full Stack",
        "Machine Learning", "Cloud Architecture", "Cybersecurity",
        "Mobile Apps", "DevOps", "Data Science", "Digital Marketing"
    ];

    // Double the array for seamless looping
    const doubledSkills = [...skills, ...skills];

    return (
        <div className="w-full bg-black py-10 overflow-hidden border-b border-gray-900 relative">
            {/* Gradient Mask for Edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <motion.div
                className="flex whitespace-nowrap gap-8"
                animate={{ x: [0, -1920] }} // Adjust based on content width
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {doubledSkills.map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 px-8 py-4 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-purple-500/50 transition-all cursor-default group"
                    >
                        <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-150 transition-transform" />
                        <span className="text-xl font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest">
                            {skill}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default BrandTicker;
