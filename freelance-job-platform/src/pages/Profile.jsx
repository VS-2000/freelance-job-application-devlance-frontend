import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    FaUser, FaStar, FaExternalLinkAlt, FaEnvelope, FaMapMarkerAlt,
    FaBriefcase, FaEdit, FaSave, FaTimes, FaPlus, FaTrash,
    FaChartLine, FaProjectDiagram, FaCheckCircle, FaAward, FaWallet, FaExclamationCircle
} from "react-icons/fa";

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, refreshUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Form states
    const [formData, setFormData] = useState({
        title: "",
        bio: "",
        location: "",
        hourlyRate: "",
        skills: [],
        portfolio: []
    });

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
        : "N/A";

    useEffect(() => {
        if (currentUser && !currentUser.isVerified) {
            refreshUser();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profRes, revRes] = await Promise.all([
                    API.get(`/users/${id}`),
                    API.get(`/reviews/${id}`)
                ]);
                setProfile(profRes.data);
                setReviews(revRes.data);

                // Fetch jobs only if viewing own profile
                if (currentUser?._id === id) {
                    const jobsRes = await API.get('/jobs/my');
                    setMyJobs(jobsRes.data);
                }

                setFormData({
                    title: profRes.data.title || "",
                    bio: profRes.data.bio || "",
                    location: profRes.data.location || "Remote, Earth",
                    hourlyRate: profRes.data.hourlyRate || "",
                    profilePicture: profRes.data.profilePicture || "",
                    skills: profRes.data.skills || [],
                    portfolio: profRes.data.portfolio || []
                });
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdateProfile = async () => {
        try {
            const res = await API.put("/users/profile", formData);
            setProfile(prev => ({ ...prev, ...res.data }));
            if (res.status === 200) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (err) {
            toast.error("Failed to update profile");
        }
    };

    const handleAddSkill = () => {
        const skill = prompt("Enter new skill:");
        if (skill) setFormData({ ...formData, skills: [...formData.skills, skill] });
    };

    const handleRemoveSkill = (index) => {
        const newSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleAddPortfolio = () => {
        setFormData({
            ...formData,
            portfolio: [...formData.portfolio, { title: "New Project", description: "", link: "" }]
        });
    };

    const handleUpdatePortfolio = (index, field, value) => {
        const newPortfolio = [...formData.portfolio];
        newPortfolio[index][field] = value;
        setFormData({ ...formData, portfolio: newPortfolio });
    };

    const handleRemovePortfolio = (index) => {
        const newPortfolio = formData.portfolio.filter((_, i) => i !== index);
        setFormData({ ...formData, portfolio: newPortfolio });
    };

    const handleAcceptProposal = async (jobId, proposalId) => {
        try {
            await API.put(`/jobs/${jobId}/accept/${proposalId}`);
            toast.success("Proposal accepted!");
            const jobsRes = await API.get('/jobs/my');
            setMyJobs(jobsRes.data);
        } catch (err) {
            toast.error("Failed to accept proposal");
        }
    };

    const handleDeclineProposal = async (jobId, proposalId) => {
        try {
            await API.put(`/jobs/${jobId}/decline/${proposalId}`);
            toast.success("Proposal declined");
            const jobsRes = await API.get('/jobs/my');
            setMyJobs(jobsRes.data);
        } catch (err) {
            toast.error("Failed to decline proposal");
        }
    };

    const handleApproveWork = async (jobId) => {
        if (!window.confirm("Approve work and release escrowed funds to the freelancer?")) return;
        try {
            await API.put(`/jobs/${jobId}/approve`);
            toast.success("Work approved and funds released!");
            const jobsRes = await API.get('/jobs/my');
            setMyJobs(jobsRes.data);
        } catch (err) {
            toast.error("Failed to approve work");
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white animate-pulse">Loading Profile...</div>;
    if (!profile) return <div className="min-h-screen bg-black flex items-center justify-center text-white">User not found</div>;

    const isOwnProfile = currentUser?._id === id;
    const isFreelancer = profile.role === 'freelancer';

    // Stats Display Logic
    const stats = profile.stats || { jobsCount: 0, totalMoney: 0 };
    const statLabel1 = isFreelancer ? "Jobs Completed" : "Jobs Posted";
    const statLabel2 = isFreelancer ? "Total Earnings" : "Total Spent";
    const statColor = isFreelancer ? "text-green-400" : "text-purple-400";

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Header / Hero */}
            <div className="relative bg-gray-900 border-b border-gray-800 pb-12 pt-28 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
                    {/* Avatar */}
                    <div className="w-40 h-40 md:w-52 md:h-52 bg-black rounded-full p-2 border-4 border-gray-800 shadow-2xl relative group">
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900 shadow-inner relative">
                            {profile.profilePicture || formData.profilePicture ? (
                                <img
                                    src={isEditing && formData.profilePicture ? formData.profilePicture : profile.profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-6xl font-black text-white">
                                    {profile.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        {profile.isVerified && (
                            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full border-4 border-black text-xl z-20" title="Verified">
                                <FaCheckCircle />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">{profile.name}</h1>
                            {isEditing ? (
                                <input
                                    className="bg-black border border-gray-700 rounded-lg px-3 py-1 text-xl text-purple-400 font-bold w-full max-w-sm focus:border-purple-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Full Stack Developer"
                                />
                            ) : (
                                <p className="text-xl text-purple-400 font-bold">{profile.title || (isFreelancer ? "Professional Freelancer" : "Client Account")}</p>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium text-gray-400">
                            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" />
                                {isEditing ? (
                                    <input
                                        className="bg-gray-800 rounded px-2 py-1 text-white border border-gray-700"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                ) : profile.location || "Remote"}
                            </div>
                            <div className="flex items-center gap-2"><FaStar className="text-yellow-500" /> {averageRating} ({reviews.length} reviews)</div>
                            <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500" /> {profile.email}</div>
                        </div>

                        {/* Badges / Stats Row */}
                        {!isEditing && (
                            <div className="flex gap-4 justify-center md:justify-start pt-2">
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Available for work
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        {isOwnProfile ? (
                            <button
                                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${isEditing
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-green-900/20'
                                    : 'bg-white text-black hover:bg-gray-100 shadow-white/10'
                                    }`}
                            >
                                {isEditing ? <><FaSave className="text-lg" /> Save Changes</> : <><FaEdit className="text-lg" /> Edit Profile</>}
                            </button>
                        ) : (
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Contact Me
                            </button>
                        )}

                        <div className="bg-black/50 p-4 rounded-2xl border border-gray-800 text-center">
                            <span className="text-xs text-gray-500 uppercase font-black tracking-widest block mb-1">Hourly Rate</span>
                            {isEditing ? (
                                <div className="flex items-center justify-center gap-1">
                                    <span className="text-purple-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        className="bg-gray-800 w-20 rounded p-1 text-center font-bold text-white outline-none"
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <span className="text-xl font-black text-white">
                                    {profile.hourlyRate ? `₹${profile.hourlyRate}/hr` : 'Negotiable'}
                                </span >
                            )}
                        </div >
                    </div >
                </div >
            </div >

            {/* Verification Warning for Own Profile */}
            {isOwnProfile && !profile.isVerified && (
                <div className="max-w-6xl mx-auto px-4 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/10 border border-red-900/20 rounded-3xl p-6 flex items-start gap-4"
                    >
                        <div className="w-12 h-12 bg-red-900/30 rounded-2xl flex items-center justify-center shrink-0">
                            <FaExclamationCircle className="text-red-500 text-2xl" />
                        </div>
                        <div>
                            <h4 className="text-red-500 font-black uppercase text-xs tracking-widest mb-1">Account Verification Pending</h4>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                Your account is currently pending manual verification by our administration team.
                                You can still browse the platform and update your profile, but certain actions like
                                {profile.role === 'client' ? ' posting jobs' : ' submitting proposals'} will be restricted until you are verified.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Main Content Area */}
            < div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12" >

                {/* Left Column (Stats & Skills) */}
                < div className="space-y-8" >
                    {/* Stats Card */}
                    < div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl" >
                        <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest mb-6">Performance Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black p-4 rounded-2xl border border-gray-800">
                                <FaBriefcase className="text-purple-600 text-xl mb-2" />
                                <div className="text-2xl font-black text-white">{stats.jobsCount}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{statLabel1}</div>
                            </div>
                            <div className="bg-black p-4 rounded-2xl border border-gray-800">
                                <FaChartLine className={`${statColor} text-xl mb-2`} />
                                <div className={`text-2xl font-black ${statColor}`}>₹{(stats.totalMoney || 0).toLocaleString()}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{statLabel2}</div>
                            </div>
                        </div>
                    </div >

                    {/* Skills */}
                    < div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-xl" >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest">Skills & Expertise</h3>
                            {isEditing && (
                                <button
                                    onClick={handleAddSkill}
                                    className="w-8 h-8 rounded-lg bg-gray-800 text-purple-400 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all hover:rotate-90"
                                >
                                    <FaPlus />
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(isEditing ? formData.skills : profile.skills)?.length > 0 ? (
                                (isEditing ? formData.skills : profile.skills).map((skill, idx) => (
                                    <span key={idx} className="bg-black border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                        {skill}
                                        {isEditing && <button onClick={() => handleRemoveSkill(idx)} className="text-red-500 hover:text-red-400"><FaTimes /></button>}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600 text-sm italic">No skills added yet.</p>
                            )}
                        </div>
                    </div >
                </div >

                {/* Right Column (Tabs: Overview, Portfolio, Reviews) */}
                < div className="lg:col-span-2" >
                    {/* Tabs */}
                    < div className="flex gap-6 border-b border-gray-800 mb-8 overflow-x-auto" >
                        {
                            ['overview', 'portfolio', 'reviews', ...(isOwnProfile ? ['my-jobs'] : [])].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-black uppercase tracking-widest transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    {tab.replace('-', ' ')}
                                    {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-full" />}
                                </button>
                            ))
                        }
                    </div >

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800">
                                    <h3 className="text-xl font-bold text-white mb-4">About Me</h3>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full bg-black border border-gray-700 rounded-xl p-4 text-gray-300 focus:border-purple-600 outline-none h-40"
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Write a compelling bio..."
                                        />
                                    ) : (
                                        <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                                            {profile.bio || "No bio information provided. This user prefers to let their work speak for itself."}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'portfolio' && (
                            <motion.div
                                key="portfolio"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Notable Projects</h3>
                                    {isEditing && (
                                        <button
                                            onClick={handleAddPortfolio}
                                            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-900/20"
                                        >
                                            <FaPlus /> Add Project
                                        </button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {(isEditing ? formData.portfolio : profile.portfolio)?.length > 0 ? (
                                        (isEditing ? formData.portfolio : profile.portfolio).map((item, index) => (
                                            <div key={index} className="group bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-purple-600/50 transition-colors relative">
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemovePortfolio(index)}
                                                        className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center z-20 shadow-lg"
                                                    >
                                                        <FaTrash size={12} />
                                                    </button>
                                                )}

                                                <div className="h-40 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black opacity-50"></div>
                                                    <FaProjectDiagram className="text-gray-600 text-5xl relative z-10 group-hover:scale-110 transition-transform duration-500" />
                                                </div>

                                                <div className="p-6">
                                                    {isEditing ? (
                                                        <div className="space-y-3">
                                                            <input
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-white font-bold"
                                                                value={item.title}
                                                                onChange={(e) => handleUpdatePortfolio(index, 'title', e.target.value)}
                                                                placeholder="Project Title"
                                                            />
                                                            <input
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-gray-400 text-xs"
                                                                value={item.description}
                                                                onChange={(e) => handleUpdatePortfolio(index, 'description', e.target.value)}
                                                                placeholder="Description"
                                                            />
                                                            <input
                                                                className="w-full bg-black border border-gray-700 rounded p-2 text-purple-400 text-xs"
                                                                value={item.link}
                                                                onChange={(e) => handleUpdatePortfolio(index, 'link', e.target.value)}
                                                                placeholder="Link"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                                                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{item.description}</p>
                                                            <a href={item.link} target="_blank" rel="noreferrer" className="text-purple-400 text-sm font-bold flex items-center gap-2 hover:underline">
                                                                View Project <FaExternalLinkAlt size={12} />
                                                            </a>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl text-gray-500">
                                            No portfolio items to show.
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        Reviews & Ratings
                                        {reviews.length > 0 && (
                                            <span className="text-base font-normal text-gray-400">
                                                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                            </span>
                                        )}
                                    </h3>
                                </div>

                                {reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((r) => (
                                            <div key={r._id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg hover:border-purple-600/30 transition-all">
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
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl text-gray-500">
                                        <FaStar size={40} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No reviews yet.</p>
                                        <p className="text-sm mt-2">Complete jobs to start receiving reviews.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'my-jobs' && isOwnProfile && (
                            <motion.div
                                key="my-jobs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">{['client', 'admin'].includes(profile.role) ? 'Posted Jobs' : 'Active Projects'}</h3>
                                </div>
                                {myJobs.length > 0 ? (
                                    <div className="grid gap-4">
                                        {myJobs.map(job => (
                                            <div key={job._id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-purple-600/50 transition-all group">
                                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${job.status === 'open' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                                job.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                                }`}>
                                                                {job.status}
                                                            </span>
                                                            <span className="text-gray-600 text-xs font-bold">{new Date(job.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{job.title}</h4>
                                                        <p className="text-gray-500 text-sm line-clamp-1">{job.description}</p>

                                                        {/* Freelancer details for Client */}
                                                        {profile.role === 'client' && job.freelancer && (
                                                            <div className="mt-4 pt-4 border-t border-gray-800/50">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                                        {job.freelancer.name?.charAt(0)}
                                                                    </div>
                                                                    <span className="text-xs font-bold text-gray-300">Hired: {job.freelancer.name}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {job.freelancer.skills?.slice(0, 3).map((skill, i) => (
                                                                        <span key={i} className="text-[9px] bg-black text-gray-500 px-2 py-0.5 rounded border border-gray-800 uppercase font-bold">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                    {job.freelancer.skills?.length > 3 && <span className="text-[9px] text-gray-600 font-bold">+{job.freelancer.skills.length - 3} more</span>}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Client details for Freelancer */}
                                                        {/* Client details for Freelancer */}
                                                        {profile.role === 'freelancer' && job.client && (
                                                            <div className="mt-4 pt-4 border-t border-gray-800/50">
                                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Client: {job.client.name}</span>
                                                            </div>
                                                        )}

                                                        {/* Proposals list for Open jobs (Client only) */}
                                                        {profile.role === 'client' && job.status === 'open' && job.proposals?.length > 0 && (
                                                            <div className="mt-6 pt-6 border-t border-gray-800 space-y-4">
                                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Pending Proposals ({job.proposals.length})</h5>
                                                                <div className="space-y-3">
                                                                    {job.proposals.slice(0, 3).map((p, idx) => (
                                                                        <div key={idx} className="bg-black/40 border border-gray-800/50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                                                    {p.freelancer?.name?.charAt(0)}
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm font-bold text-white">{p.freelancer?.name}</div>
                                                                                    <div className="flex gap-1 flex-wrap mt-1">
                                                                                        {p.freelancer?.skills?.slice(0, 2).map((s, i) => (
                                                                                            <span key={i} className="text-[8px] bg-gray-900 text-gray-400 px-1.5 py-0.5 rounded border border-gray-800 font-bold uppercase">{s}</span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                                                <div className="text-md font-black text-purple-400">₹{p.bidAmount?.toLocaleString()}</div>
                                                                                <div className="flex gap-2">
                                                                                    <button
                                                                                        onClick={() => handleAcceptProposal(job._id, p._id)}
                                                                                        className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-md"
                                                                                    >
                                                                                        Accept
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleDeclineProposal(job._id, p._id)}
                                                                                        className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-gray-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-gray-800"
                                                                                    >
                                                                                        Decline
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {job.proposals.length > 3 && (
                                                                        <p className="text-[10px] text-gray-600 font-bold text-center">+{job.proposals.length - 3} more proposals received</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-start md:items-end justify-between min-w-[140px]">
                                                        <div className="text-right">
                                                            <div className="text-xl font-black text-white">₹{job.budget?.toLocaleString()}</div>
                                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter italic">Final Budget</div>
                                                        </div>
                                                        <div className="flex gap-2 mt-4 md:mt-0">
                                                            <a href={`/job/${job._id}`} className="p-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-white hover:text-black transition-all group/btn" title="View Details">
                                                                <FaExternalLinkAlt size={14} />
                                                            </a>
                                                            <a href="/messages" className="p-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2 px-4 shadow-lg shadow-purple-900/10" title="Chat/Negotiate">
                                                                <FaEnvelope size={14} />
                                                                <span className="text-xs font-bold uppercase tracking-widest">Negotiate</span>
                                                            </a>
                                                            {profile.role === 'client' && job.status === 'in-progress' && (!job.payment || job.payment.status !== 'escrow') && (
                                                                <a href={`/payment/${job._id}`} className="p-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all flex items-center gap-2 px-4 shadow-lg shadow-purple-900/20" title="Proceed to Payment">
                                                                    <FaWallet size={14} />
                                                                    <span className="text-xs font-bold uppercase tracking-widest">Pay</span>
                                                                </a>
                                                            )}
                                                            {profile.role === 'client' && job.status === 'in-progress' && job.payment?.status === 'escrow' && job.submission && (
                                                                <button
                                                                    onClick={() => handleApproveWork(job._id)}
                                                                    className="p-2.5 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all flex items-center gap-2 px-4 shadow-lg shadow-green-900/20"
                                                                    title="Approve & Release Funds"
                                                                >
                                                                    <FaCheckCircle size={14} />
                                                                    <span className="text-xs font-bold uppercase tracking-widest">Approve</span>
                                                                </button>
                                                            )}
                                                            {job.status === 'completed' && (
                                                                <a href={`/reviews/${profile.role === 'client' ? job.freelancer?._id : job.client?._id}`} className="p-2.5 bg-yellow-500/10 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-black transition-all" title="Add Review">
                                                                    <FaAward size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-[40px] text-gray-500">
                                        <FaProjectDiagram size={40} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">No jobs to display yet.</p>
                                        {profile.role === 'client' && (
                                            <a href="/post-job" className="mt-4 inline-block text-purple-400 font-bold hover:underline">Post your first job</a>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div >
            </div >
        </div >
    );
};

export default Profile;
