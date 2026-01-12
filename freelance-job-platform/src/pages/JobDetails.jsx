import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";
import { FaStar, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();

  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionDesc, setSubmissionDesc] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    if (user && !user.isVerified) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);

        if (user?.role === "client") {
          const propRes = await API.get(`/jobs/${id}/proposals`);
          setProposals(propRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const submitProposal = async () => {
    try {
      await API.post("/proposals", {
        jobId: id,
        coverLetter,
        bidAmount,
        deliveryTime: 5,
      });
      toast.success("Proposal submitted successfully");
      setCoverLetter("");
      setBidAmount("");
    } catch (err) {
      toast.error("Failed to submit proposal");
    }
  };

  const acceptProposal = async (proposalId) => {
    try {
      await API.put(`/jobs/${id}/accept/${proposalId}`);
      toast.success("Proposal accepted");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to accept proposal");
    }
  };

  const handleSubmitWork = async () => {
    try {
      await API.post(`/jobs/${id}/submit`, {
        url: submissionUrl,
        description: submissionDesc,
      });
      toast.success("Work submitted for review!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to submit work");
    }
  };

  const handleApproveWork = async () => {
    try {
      await API.put(`/jobs/${id}/approve`);
      toast.success("Work approved and funds released!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to approve work");
    }
  };

  const handleAddReview = async () => {
    try {
      await API.post(`/reviews`, {
        job: id,
        reviewee: user.role?.toLowerCase() === 'client' ? job.freelancer : job.client._id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success("Review submitted!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to submit review");
    }
  }

  if (loading) return <p className="p-6 text-center animate-pulse">Loading Project Details...</p>;
  if (!job) return <p className="p-6 text-center">Job not found</p>;

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="w-full px-4 md:px-10 py-12">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-8">
          <div className="max-w-4xl flex-1 w-full">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight"
            >
              {job.title}
            </motion.h2>
            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-gray-400 font-medium">
              <span className="bg-purple-900/50 text-purple-300 border border-purple-700/50 px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px]">{job.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">•</span>
                <span>Experience: <span className="text-white font-bold">{job.experienceLevel}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">•</span>
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              {job.paymentStatus && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="hidden sm:inline text-gray-700">•</span>
                  <span className={`px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] border ${job.paymentStatus === 'escrow' ? 'bg-green-900/30 text-green-400 border-green-700/50' :
                    job.paymentStatus === 'released' ? 'bg-blue-900/30 text-blue-400 border-blue-700/50' :
                      'bg-yellow-900/30 text-yellow-500 border-yellow-700/50'
                    }`}>
                    Payment: {job.paymentStatus === 'escrow' ? 'Verified (In Escrow)' :
                      job.paymentStatus === 'released' ? 'Released to Freelancer' :
                        'Awaiting Funding'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-auto bg-gray-900 p-8 rounded-[32px] border border-gray-800 shadow-2xl shadow-purple-900/10 lg:min-w-[280px] text-center lg:text-right">
            <div className="text-4xl sm:text-5xl font-black text-white">₹{job.budget?.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Project Budget (Secure Escrow)</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-12">
            <section className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-800">
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl font-black text-white mb-6 flex items-center"
              >
                <span className="w-8 h-8 bg-gray-800 text-purple-400 rounded-lg flex items-center justify-center mr-3 text-sm border border-gray-700">1</span>
                Project Description
              </motion.h3>
              <p className="text-gray-400 leading-relaxed text-lg italic bg-black/50 p-6 rounded-2xl border border-gray-800">{job.description}</p>
            </section>

            {/* Submission Status Section */}
            {job.submission && (
              <section className="bg-gray-900 p-8 rounded-[32px] shadow-sm border border-purple-900/50 bg-purple-900/10">
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-black text-purple-400 mb-6 flex items-center"
                >
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center mr-3 text-sm">✓</span>
                  Work Submission
                </motion.h3>
                <div className="space-y-4">
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Description</div>
                  <p className="text-gray-300 bg-black p-4 rounded-xl border border-gray-800 shadow-sm">{job.submission.description}</p>

                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Project Link</div>
                  <a href={job.submission.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-purple-400 font-black hover:underline gap-2 bg-black px-6 py-3 rounded-xl border border-gray-800 shadow-sm hover:bg-gray-800 transition-colors">
                    View Delivered Work <span className="text-xs opacity-50">↗</span>
                  </a>
                </div>

                {user?.role === "client" && job.status === "in-progress" && (
                  <div className="mt-8 pt-8 border-t border-purple-900/30">
                    <button
                      onClick={handleApproveWork}
                      className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-purple-900/20 hover:scale-[1.02] transition-all hover:bg-purple-500"
                    >
                      Approve Work & Release Funds
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-4 italic">By clicking approve, you authorize the release of escrowed funds to the freelancer.</p>
                  </div>
                )}
              </section>
            )}

            {/* Review Section for Completed Jobs */}
            {job.status === "completed" && (
              <section className="bg-gray-900 p-8 rounded-[32px] shadow-lg border border-yellow-900/30 bg-yellow-900/5">
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-black text-yellow-500 mb-6 flex items-center"
                >
                  <span className="w-8 h-8 bg-yellow-600/20 text-yellow-500 rounded-lg flex items-center justify-center mr-3 text-sm border border-yellow-600/30">★</span>
                  Share Your Experience
                </motion.h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">How was your experience?</label>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${reviewRating >= star ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-900/20 scale-110' : 'bg-black text-gray-700 hover:bg-gray-800'
                            }`}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Detailed Feedback</label>
                    <textarea
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-sm text-white focus:border-yellow-500 focus:outline-none transition-all placeholder:text-gray-600"
                      placeholder="Tell us more about the collaboration..."
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleAddReview}
                    className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black shadow-xl shadow-yellow-900/20 hover:scale-[1.02] transition-all hover:bg-yellow-400"
                  >
                    Submit Feedback
                  </button>
                </div>
              </section>
            )}

            {/* Freelancer Work Submission Area */}
            {user?.role === "freelancer" && job.status === "in-progress" && !job.submission && (
              <section className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-gray-800">
                <div className="relative z-10">
                  <motion.h3
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl font-black mb-6"
                  >
                    Deliver Completed Work
                  </motion.h3>

                  {job.paymentStatus !== "escrow" ? (
                    <div className="bg-yellow-900/10 border border-yellow-900/20 rounded-2xl p-6 mb-4">
                      <div className="flex items-center gap-3 text-yellow-500 mb-2">
                        <FaExclamationCircle />
                        <span className="font-black uppercase text-[10px] tracking-widest">Payment Not Verified</span>
                      </div>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">
                        Wait for the client to fund this project before submitting work. This ensures your payment is secured in escrow.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Project URL (Drive, Github, etc.)</label>
                        <input
                          type="url"
                          className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700 text-white"
                          placeholder="https://your-work-link.com"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Delivery Note</label>
                        <textarea
                          className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700 text-white"
                          placeholder="Briefly describe what you've delivered..."
                          rows={4}
                          value={submissionDesc}
                          onChange={(e) => setSubmissionDesc(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={handleSubmitWork}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-gray-200 transition-colors shadow-lg"
                      >
                        Submit Work for Review
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              </section>
            )}

            {/* Client View Proposals */}
            {user?.role === "client" && job.status === "open" && (
              <div className="mt-8">
                <motion.h3
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl font-bold mb-6 text-white"
                >
                  Received Proposals
                </motion.h3>

                {proposals.length === 0 && (
                  <p className="text-gray-500 italic">No proposals yet</p>
                )}

                <div className="space-y-4">
                  {proposals.map((p) => (
                    <div key={p._id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-sm hover:border-gray-700 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-purple-400 font-bold border border-gray-700">
                            {p.freelancer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1">
                              {p.freelancer.name}
                              {p.freelancer.isVerified && <FaCheckCircle className="text-blue-500 text-xs" />}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">Freelancer</div>
                          </div>
                        </div>
                        <div className="font-black text-purple-400 text-lg">₹{p.bidAmount}</div>
                      </div>
                      <p className="text-gray-400 text-sm mb-6 bg-black p-4 rounded-2xl italic border border-gray-800">"{p.coverLetter}"</p>

                      <div className="flex gap-4">
                        <button
                          onClick={() => acceptProposal(p._id)}
                          className="flex-1 bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all text-sm"
                        >
                          {p.status === 'accepted' ? 'Accepted' : 'Accept Proposal'}
                        </button>
                        <button
                          onClick={() => setShowChat(true)}
                          className="px-4 py-2 border-2 border-gray-800 rounded-xl font-bold text-gray-500 hover:text-white hover:border-white transition-all text-sm"
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gray-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden border border-gray-800">
              <div className="relative z-10">
                <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                  Project Client
                  {job.client?.isVerified && <FaCheckCircle className="text-blue-500 text-sm" />}
                </h4>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center text-purple-300 font-black border border-purple-800">
                    {job.client?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white">{job.client?.name}</div>
                    <div className="text-xs text-gray-500">{job.client?.email}</div>
                  </div>
                </div>
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Project Overview</h4>
                <ul className="space-y-4 text-sm text-gray-400 font-medium">
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Category:</span> <span className="text-white font-bold">{job.category}</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Deadline:</span> <span className="text-white font-bold">{new Date(job.deadline).toLocaleDateString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Status:</span> <span className="text-green-400 font-bold uppercase tracking-wider">{job.status}</span>
                  </li>
                </ul>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
            </div>

            {/* Actions */}
            {user?.role === "client" && job.status === "in-progress" && (
              <Link
                to={`/payment/${job._id}`}
                className="block text-center bg-purple-600 text-white px-6 py-4 rounded-3xl font-black shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform active:scale-95"
              >
                Proceed to Payment
              </Link>
            )}

            {user?.role === "freelancer" && job.status === "open" && (
              <div className="bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-800">
                <h4 className="font-bold text-white mb-4">Submit Your Proposal</h4>

                {!user?.isVerified ? (
                  <div className="bg-red-900/10 border border-red-900/20 rounded-2xl p-6 mb-4">
                    <div className="flex items-center gap-3 text-red-500 mb-2">
                      <FaExclamationCircle />
                      <span className="font-black uppercase text-[10px] tracking-widest">Verification Required</span>
                    </div>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed">
                      Your account must be manually verified by an admin before you can bid on projects. This maintains platform integrity.
                    </p>
                  </div>
                ) : (
                  <>
                    <textarea
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-sm text-white focus:border-purple-600 focus:outline-none transition-all mb-4 placeholder:text-gray-600"
                      placeholder="Why are you the best fit for this job?"
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <div className="relative mb-6">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-purple-500">₹</span>
                      <input
                        type="number"
                        className="w-full bg-black border-2 border-gray-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-600 focus:outline-none transition-all font-bold placeholder:text-gray-600"
                        placeholder="Your bid"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={submitProposal}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-colors shadow-lg"
                    >
                      Submit Proposal
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowChat(true)}
                  className="w-full mt-4 py-3 border-2 border-gray-800 rounded-2xl font-bold text-gray-500 hover:text-white hover:border-white transition-all text-sm"
                >
                  Chat with Client
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Floating Chat Window Overlay */}
        {showChat && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
            <div className="relative w-full max-w-lg">
              <button
                onClick={() => setShowChat(false)}
                className="absolute -top-12 right-0 text-white font-bold hover:text-purple-400"
              >
                Close Chat
              </button>
              <ChatWindow
                jobId={id}
                otherUserId={user?.role === "client" ? (job.freelancer || proposals[0]?.freelancer?._id) : job.client?._id}
                otherUserName={user?.role === "client" ? "Freelancer" : "Client"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
