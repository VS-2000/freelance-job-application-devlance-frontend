import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import { FaChartLine, FaWallet, FaUsers, FaCheckCircle, FaShieldAlt, FaTrash, FaPlus, FaTimes, FaBriefcase, FaLayerGroup, FaCalendarAlt, FaExclamationCircle, FaEdit, FaSync, FaEnvelope, FaPaperPlane, FaComments, FaInbox } from "react-icons/fa";

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("all");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [jobPostLoading, setJobPostLoading] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobProposals, setSelectedJobProposals] = useState(null);
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [directMessages, setDirectMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankDetails, setBankDetails] = useState({ accountNumber: "", ifscCode: "", bankName: "", upiId: "" });
  const [withdrawMethod, setWithdrawMethod] = useState("bank");
  const [commissionData, setCommissionData] = useState({});

  const [newJobData, setNewJobData] = useState({
    title: "",
    description: "",
    budget: "",
    category: "Web Dev",
    experienceLevel: "Intermediate",
    deadline: ""
  });

  const categories = ["Web Dev", "Design", "Writing", "Marketing", "Data Science", "Others"];
  const levels = ["Entry", "Intermediate", "Expert"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        API.get("/admin/stats"),
        API.get("/admin/payments"),
        API.get("/admin/users"),
        API.get("/admin/jobs"),
        API.get("/admin/my-jobs"),
        API.get("/contact/admin"),
        API.get("/messages/admin/inbox"),
        API.get("/admin/commission")
      ]);

      const [statsRes, paymentsRes, usersRes, jobsRes, adminJobsRes, contactsRes, messagesRes, commissionRes] = results;

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      else console.error("Stats fetch failed", statsRes.reason);

      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data);
      else console.error("Payments fetch failed", paymentsRes.reason);

      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      else console.error("Users fetch failed", usersRes.reason);

      if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data);
      else console.error("Jobs fetch failed", jobsRes.reason);

      if (adminJobsRes.status === 'fulfilled') setAdminJobs(adminJobsRes.value.data);
      else console.error("Admin jobs fetch failed", adminJobsRes.reason);

      if (contactsRes.status === 'fulfilled') setContacts(contactsRes.value.data);
      else console.error("Contacts fetch failed", contactsRes.reason);

      if (messagesRes.status === 'fulfilled') setDirectMessages(messagesRes.value.data);
      else {
        console.error("Messages fetch failed", messagesRes.reason);
        setDirectMessages([]); // Fallback to empty array
      }

      if (commissionRes.status === 'fulfilled') {
        setWithdrawals(commissionRes.value.data.withdrawals);
        setCommissionData(commissionRes.value.data);
      } else console.error("Commission fetch failed", commissionRes.reason);

    } catch (err) {
      console.error("Admin data fetch critical error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (userId) => {
    try {
      const res = await API.put(`/admin/verify/${userId}`);
      const updatedUser = res.data.user;
      toast.success(res.data.message);
      setUsers(users.map(u => u._id === userId ? { ...u, isVerified: updatedUser.isVerified } : u));
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Process failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      toast.success("User removed");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      setAdminJobs(adminJobs.filter(j => j._id !== jobId));
      toast.success("Job deleted");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const handleUpdatePaymentStatus = async (paymentId, status) => {
    try {
      await API.put(`/admin/payments/${paymentId}`, { status });
      setPayments(payments.map(p => p._id === paymentId ? { ...p, status } : p));
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobPostLoading(true);
    try {
      await API.post("/jobs", { ...newJobData, budget: Number(newJobData.budget) });
      toast.success("Job posted successfully!");
      setShowPostJobModal(false);
      setNewJobData({
        title: "",
        description: "",
        budget: "",
        category: "Web Dev",
        experienceLevel: "Intermediate",
        deadline: ""
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setJobPostLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJobData({
      title: job.title,
      description: job.description,
      budget: job.budget,
      category: job.category,
      experienceLevel: job.experienceLevel,
      deadline: job.deadline ? job.deadline.split('T')[0] : ""
    });
    setShowEditJobModal(true);
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setJobPostLoading(true);
    try {
      await API.put(`/jobs/${editingJob._id}`, { ...newJobData, budget: Number(newJobData.budget) });
      toast.success("Job updated successfully!");
      setShowEditJobModal(false);
      setEditingJob(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update job");
    } finally {
      setJobPostLoading(false);
    }
  };

  const handleRepost = async (job) => {
    // Reposting: set status to open and set a new deadline (7 days from now)
    const newDeadline = new Date();
    newDeadline.setDate(newDeadline.getDate() + 7);

    setJobPostLoading(true);
    try {
      await API.put(`/jobs/${job._id}`, {
        status: "open",
        deadline: newDeadline.toISOString().split('T')[0]
      });
      toast.success("Job reposted for 7 more days!");
      fetchData();
    } catch (err) {
      toast.error("Failed to repost job");
    } finally {
      setJobPostLoading(false);
    }
  };

  const handleAcceptProposal = async (jobId, proposalId) => {
    try {
      await API.put(`/jobs/${jobId}/accept/${proposalId}`);
      toast.success("Proposal accepted!");
      fetchData();
      setShowProposalsModal(false);
    } catch (err) {
      toast.error("Failed to accept proposal");
    }
  };

  const handleDeclineProposal = async (jobId, proposalId) => {
    try {
      await API.put(`/jobs/${jobId}/decline/${proposalId}`);
      toast.success("Proposal declined");
      fetchData();
    } catch (err) {
      toast.error("Failed to decline proposal");
    }
  };

  const handleApproveWork = async (jobId) => {
    if (!window.confirm("Approve work and release escrowed funds to the freelancer?")) return;
    try {
      await API.put(`/jobs/${jobId}/approve`);
      toast.success("Work approved and funds released!");
      fetchData();
    } catch (err) {
      toast.error("Failed to approve work");
    }
  };

  const handleRespondToContact = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }
    try {
      await API.put(`/contact/${selectedContact._id}/respond`, { response: responseText });
      toast.success("Response sent successfully!");
      setShowResponseModal(false);
      setSelectedContact(null);
      setResponseText("");
      fetchData();
    } catch (err) {
      toast.error("Failed to send response");
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const { data } = await API.get(`/messages/direct/${user._id}`);
      setCurrentMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setCurrentMessages([]);
    }
  };

  const handleSendDirectMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUser) return;

    try {
      const { data } = await API.post("/messages/direct", {
        receiverId: selectedUser._id,
        content: messageText
      });
      setCurrentMessages([...currentMessages, data]);
      setMessageText("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await API.post("/admin/withdraw", {
        amount: Number(withdrawAmount),
        method: withdrawMethod,
        details: bankDetails
      });
      toast.success("Withdrawal successful!");
      setShowWithdrawModal(false);
      setWithdrawAmount("");
      setBankDetails({ accountNumber: "", ifscCode: "", bankName: "", upiId: "" });
      fetchData(); // Refresh everything
    } catch (err) {
      toast.error(err.response?.data?.message || "Withdrawal failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-purple-600 font-black animate-pulse">ACCESSING SECURE ADMIN INTERFACE...</div>;

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="bg-gray-900 border-b border-gray-800 mb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-black text-white flex items-center gap-3"
            >
              <FaShieldAlt className="text-purple-600" /> Admin Command Center
            </motion.h1>
            <p className="text-gray-400 font-medium mt-1 text-sm md:text-base">Platform-wide overview and management tools.</p>
          </div>
          <div className="flex gap-4 relative z-10 w-full md:w-auto">
            <button
              onClick={() => setShowPostJobModal(true)}
              className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:scale-105 active:scale-95"
            >
              <FaPlus /> Post Direct Job
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-800">
          {[
            { id: "stats", label: "Stats Overview", icon: FaChartLine },
            { id: "payments", label: "Payment Ledger", icon: FaWallet },
            { id: "users", label: "User Management", icon: FaUsers },
            { id: "jobs", label: "All Job Postings", icon: FaShieldAlt },
            { id: "my-jobs", label: "Admin Postings", icon: FaBriefcase },
            { id: "contacts", label: "Contact Messages", icon: FaEnvelope },
            { id: "messages", label: "Direct Messages", icon: FaComments },
            { id: "withdrawals", label: "Withdrawals", icon: FaWallet },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all border whitespace-nowrap ${activeTab === tab.id ? 'bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-900/30' : 'bg-gray-900 text-gray-400 hover:text-white border-gray-800'
                }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AnimatePresence mode="wait">
            {activeTab === "stats" && (
              <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <StatCard title="Total Platform Users" value={stats.totalUsers} icon={<FaUsers />} color="blue" />
                <StatCard title="Active Job Listings" value={stats.totalJobs} icon={<FaChartLine />} color="purple" />
                <StatCard title="Total Escrow Value" value={`₹${stats.totalEscrow?.toLocaleString()}`} icon={<FaWallet />} color="green" />
                <StatCard title="Available Balance" value={`₹${(stats.currentBalance || 0).toLocaleString()}`} icon={<FaShieldAlt />} color="yellow" />
                <StatCard title="Total Withdrawn" value={`₹${(stats.totalWithdrawn || 0).toLocaleString()}`} icon={<FaCheckCircle />} color="orange" />
              </motion.div>
            )}

            {(activeTab === "jobs" || activeTab === "my-jobs") && (
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                      <tr>
                        <th className="px-8 py-6">Job Info</th>
                        <th className="px-8 py-6">Creator</th>
                        <th className="px-8 py-6">Assigned To</th>
                        <th className="px-8 py-6">Budget</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-medium text-sm text-gray-300">
                      {(activeTab === "jobs" ? jobs : adminJobs).map((j) => (
                        <tr key={j._id} className="hover:bg-black/30 transition-colors">
                          <td className="px-8 py-6 max-w-xs">
                            <div className="font-bold text-white truncate">{j.title}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">{j.category}</div>
                          </td>
                          <td className="px-8 py-6 text-gray-300">
                            {j.client?.name}
                            {activeTab === "jobs" && j.client?.role === "admin" && <span className="ml-2 text-[8px] bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded border border-purple-800">ADMIN</span>}
                          </td>
                          <td className="px-8 py-6 italic text-gray-500">{j.freelancer?.name || "Unassigned"}</td>
                          <td className="px-8 py-6 font-black text-white">\u20B9{j.budget?.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${j.status === 'open' ? 'bg-green-900/30 text-green-400 border border-green-900' :
                              j.status === 'in-progress' ? 'bg-blue-900/30 text-blue-400 border border-blue-900' :
                                'bg-gray-900 text-gray-500 border border-gray-800'
                              }`}>
                              {j.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-3">
                              {activeTab === "my-jobs" && (
                                <>
                                  {j.status === 'open' && (
                                    <button
                                      onClick={() => { setSelectedJobProposals(j); setShowProposalsModal(true); }}
                                      className="relative bg-black border border-gray-800 text-purple-400 p-2.5 rounded-xl hover:bg-purple-900/20 transition-all flex items-center justify-center group"
                                      title="Manage Proposals"
                                    >
                                      <FaUsers className="text-lg" />
                                      {j.proposals?.length > 0 && (
                                        <span className="bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-full absolute -top-2 -right-2 border border-black font-black">
                                          {j.proposals.length}
                                        </span>
                                      )}
                                    </button>
                                  )}

                                  {j.status === 'in-progress' && (!j.payment || j.payment.status !== 'escrow') && (
                                    <Link
                                      to={`/payment/${j._id}`}
                                      className="bg-purple-600/20 text-purple-400 border border-purple-900/50 p-2.5 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center group"
                                      title="Proceed to Escrow Payment"
                                    >
                                      <FaWallet className="text-lg" />
                                    </Link>
                                  )}

                                  {j.status === 'in-progress' && j.payment?.status === 'escrow' && j.submission && (
                                    <button
                                      onClick={() => handleApproveWork(j._id)}
                                      className="bg-green-600/20 text-green-400 border border-green-900/50 p-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center group"
                                      title="Approve Work & Release Funds"
                                    >
                                      <FaCheckCircle className="text-lg" />
                                    </button>
                                  )}

                                  <button onClick={() => handleEditJob(j)} className="text-blue-400 hover:text-blue-300 p-2 transition-colors" title="Edit Job">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleRepost(j)} className="text-green-400 hover:text-green-300 p-2 transition-colors" title="Repost (7 Days)">
                                    <FaSync className={jobPostLoading ? "animate-spin" : ""} />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDeleteJob(j._id)} className="text-red-500 hover:text-red-400 p-2 transition-colors" title="Delete Job">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(activeTab === "my-jobs" && adminJobs.length === 0) && (
                        <tr>
                          <td colSpan="6" className="px-8 py-20 text-center text-gray-500 italic">No direct jobs posted by you yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "payments" && (
              <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                      <tr>
                        <th className="px-8 py-6">Transaction ID</th>
                        <th className="px-8 py-6">Participants</th>
                        <th className="px-8 py-6">Job Title</th>
                        <th className="px-8 py-6">Amount</th>
                        <th className="px-8 py-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-medium text-sm text-gray-300">
                      {payments.map((p) => (
                        <tr key={p._id} className="hover:bg-black/30 transition-colors">
                          <td className="px-8 py-6 font-mono text-xs text-gray-500">{p._id}</td>
                          <td className="px-8 py-6">
                            <div className="text-white font-bold">{p.client?.name}</div>
                            <div className="text-xs text-purple-400">→ {p.freelancer?.name}</div>
                          </td>
                          <td className="px-8 py-6 text-gray-400">{p.job?.title}</td>
                          <td className="px-8 py-6 font-black text-white">\u20B9{p.amount}</td>
                          <td className="px-8 py-6">
                            <select
                              value={p.status}
                              onChange={(e) => handleUpdatePaymentStatus(p._id, e.target.value)}
                              className={`bg-black text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full border outline-none ${p.status === 'released' ? 'text-green-400 border-green-900' :
                                p.status === 'escrow' ? 'text-yellow-500 border-yellow-900' :
                                  'text-red-400 border-red-900'
                                }`}
                            >
                              <option value="escrow">Escrow</option>
                              <option value="released">Released</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                      <tr>
                        <th className="px-8 py-6">User Details</th>
                        <th className="px-8 py-6">
                          <select
                            className="bg-transparent border-none outline-none cursor-pointer hover:text-white"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                          >
                            <option value="all">Role (All)</option>
                            <option value="client">Clients</option>
                            <option value="freelancer">Freelancers</option>
                          </select>
                        </th>
                        <th className="px-8 py-6">Verified</th>
                        <th className="px-8 py-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-medium text-sm text-gray-300">
                      {users
                        .filter(u => filterRole === "all" || u.role === filterRole)
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-black/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="font-bold text-white">{u.name}</div>
                              <div className="text-xs text-gray-500">{u.email}</div>
                            </td>
                            <td className="px-8 py-6 uppercase text-[10px] font-black tracking-widest text-gray-500">{u.role}</td>
                            <td className="px-8 py-6">
                              {u.isVerified ? (
                                <FaCheckCircle className="text-green-500 text-xl" />
                              ) : (
                                <span className="text-gray-600 font-bold italic opacity-50 uppercase text-[10px]">Pending</span>
                              )}
                            </td>
                            <td className="px-8 py-6 flex gap-2">
                              <button
                                onClick={() => handleVerify(u._id)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors ${u.isVerified
                                  ? "bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-white"
                                  : "bg-purple-600 text-white hover:bg-purple-500"
                                  }`}
                              >
                                {u.isVerified ? "Unverify" : "Verify"}
                              </button>
                              <button
                                onClick={() => {
                                  handleSelectUser(u);
                                  setActiveTab("messages");
                                }}
                                className="bg-purple-900/20 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border border-purple-900/50"
                              >
                                Message
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="bg-transparent text-gray-600 hover:text-red-500 p-2 transition-colors"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "contacts" && (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                      <tr>
                        <th className="px-8 py-6">Sender Info</th>
                        <th className="px-8 py-6">Message</th>
                        <th className="px-8 py-6">Date</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-medium text-sm text-gray-300">
                      {contacts.length > 0 ? (
                        contacts.map((contact) => (
                          <tr key={contact._id} className="hover:bg-black/30 transition-colors">
                            <td className="px-8 py-6">
                              <div className="font-bold text-white">{contact.name}</div>
                              <div className="text-xs text-gray-500">{contact.email}</div>
                            </td>
                            <td className="px-8 py-6 max-w-md">
                              <p className="text-gray-300 line-clamp-2">{contact.message}</p>
                            </td>
                            <td className="px-8 py-6 text-gray-400 text-xs">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${contact.status === 'responded'
                                ? 'bg-green-900/30 text-green-400 border border-green-900'
                                : 'bg-yellow-900/30 text-yellow-400 border border-yellow-900'
                                }`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center justify-center gap-3">
                                {contact.status === 'pending' ? (
                                  <button
                                    onClick={() => {
                                      setSelectedContact(contact);
                                      setShowResponseModal(true);
                                    }}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-purple-500 transition-all flex items-center gap-2"
                                  >
                                    <FaPaperPlane /> Respond
                                  </button>
                                ) : (
                                  <div className="text-xs text-gray-500 italic">
                                    Responded on {new Date(contact.adminResponse?.respondedAt).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">
                            No contact messages yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row h-[700px]"
              >
                {/* Sidebar */}
                <div className="w-full md:w-80 border-r border-gray-800 flex flex-col">
                  <div className="p-6 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {showUserPicker ? <FaUsers className="text-blue-500" /> : <FaInbox className="text-purple-500" />}
                      {showUserPicker ? "All Users" : "Recent Chats"}
                    </h3>
                    <button
                      onClick={() => setShowUserPicker(!showUserPicker)}
                      className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title={showUserPicker ? "Show Recent Chats" : "Start New Chat"}
                    >
                      {showUserPicker ? <FaTimes /> : <FaPlus />}
                    </button>
                  </div>

                  {showUserPicker && (
                    <div className="p-4 border-b border-gray-800">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-gray-800 border-none rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto">
                    {showUserPicker ? (
                      <div className="space-y-1">
                        {users
                          .filter(u => u.role !== 'admin' && (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())))
                          .map((u, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleSelectUser(u);
                                setShowUserPicker(false);
                                setUserSearch("");
                              }}
                              className="w-full text-left p-4 border-b border-gray-800 hover:bg-black/40 transition-colors flex items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-white text-sm">{u.name}</div>
                                <div className="text-[10px] text-gray-500">{u.role}</div>
                              </div>
                              <div className="text-purple-500 text-xs">Message</div>
                            </button>
                          ))}
                        {users.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No users found.</div>}
                      </div>
                    ) : (
                      directMessages.length > 0 ? (
                        directMessages.map((conv, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectUser(conv.otherUser)}
                            className={`w-full text-left p-4 border-b border-gray-800 hover:bg-black/40 transition-colors ${selectedUser?._id === conv.otherUser?._id ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                              }`}
                          >
                            <div className="font-bold text-white text-sm">{conv.otherUser?.name || 'Unknown User'}</div>
                            <div className="text-xs text-gray-500 truncate">{conv.lastMessage || 'No content'}</div>
                            <div className="text-[10px] text-gray-600 mt-1">{new Date(conv.time).toLocaleDateString()}</div>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500 italic text-sm">No recent messages</div>
                      )
                    )}
                  </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col bg-black/40">
                  {selectedUser ? (
                    <>
                      <div className="p-6 border-b border-gray-800 bg-black/40 flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-white">{selectedUser.name}</h3>
                          <span className="text-xs text-purple-400 capitalize">{selectedUser.role}</span>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-500">
                          <FaTimes />
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {currentMessages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.sender._id === selectedUser._id ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${msg.sender._id === selectedUser._id
                              ? 'bg-gray-800 text-gray-300 rounded-tl-none'
                              : 'bg-purple-600 text-white rounded-tr-none'
                              }`}>
                              {msg.content}
                              <div className={`text-[10px] mt-1 ${msg.sender._id === selectedUser._id ? 'text-gray-500' : 'text-purple-200'
                                }`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-gray-800 bg-black/40">
                        <form onSubmit={handleSendDirectMessage} className="flex gap-4">
                          <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 transition-colors placeholder-gray-400"
                          />
                          <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-purple-900/20"
                          >
                            <FaPaperPlane />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                      <FaComments size={48} className="mb-4 opacity-20" />
                      <p>Select a user to start messaging</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {activeTab === "withdrawals" && (
              <motion.div key="withdrawals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-black text-white flex items-center gap-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Platform Commission</span>
                      <div className="p-2 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400 text-xl">
                        <FaWallet />
                      </div>
                    </h2>
                    <p className="text-gray-500 font-medium">Manage platform earnings and payouts</p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#111] border border-gray-800 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group w-full md:w-auto min-w-[320px]"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-600/20 transition-colors"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Available Commission</p>
                    <h2 className="text-4xl font-black mb-6 text-white">₹{(commissionData.currentBalance || 0).toLocaleString()}</h2>
                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl"
                    >
                      <FaPlus /> Withdraw Funds
                    </button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-4 border border-green-500/20">
                      <FaChartLine />
                    </div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Total Earned</p>
                    <p className="text-2xl font-black text-white">₹{(commissionData.totalEarned || 0).toLocaleString()}</p>
                  </div>

                  <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4 border border-yellow-500/20">
                      <FaSync />
                    </div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Total Withdrawn</p>
                    <p className="text-2xl font-black text-white">₹{(commissionData.totalWithdrawn || 0).toLocaleString()}</p>
                  </div>

                  <div className="bg-[#0c0c0c] border border-gray-800 p-6 rounded-3xl">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-4 border border-purple-500/20">
                      <FaHistory />
                    </div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Recent Activity</p>
                    <p className="text-2xl font-black text-white">{withdrawals.length} Payouts</p>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-[32px] shadow-2xl border border-gray-800 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-800 bg-black/20 flex justify-between items-center">
                    <h3 className="font-black text-white uppercase text-xs tracking-widest">Withdrawal Status Tracker</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-black text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-800">
                        <tr>
                          <th className="px-8 py-6">Request Date</th>
                          <th className="px-8 py-6">Payout Amount</th>
                          <th className="px-8 py-6">Method / Details</th>
                          <th className="px-8 py-6">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800 font-medium text-sm text-gray-300">
                        {withdrawals.length > 0 ? withdrawals.map((w) => (
                          <tr key={w._id} className="hover:bg-black/30 transition-colors">
                            <td className="px-8 py-6">{new Date(w.createdAt).toLocaleDateString()}</td>
                            <td className="px-8 py-6 font-black text-white">₹{w.amount.toLocaleString()}</td>
                            <td className="px-8 py-6">
                              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{w.method || 'Bank'}</div>
                              <div className="text-[10px] text-gray-500 italic truncate max-w-[200px]">
                                {w.method === 'upi' ? w.details?.upiId : `${w.details?.bankName || 'N/A'} - ${w.details?.accountNumber || 'N/A'}`}
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${w.status === 'completed' ? 'bg-green-900/10 text-green-500 border-green-900/50' :
                                w.status === 'pending' ? 'bg-yellow-900/10 text-yellow-500 border-yellow-900/50' :
                                  'bg-red-900/10 text-red-500 border-red-900/50'
                                }`}>
                                {w.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-8 py-20 text-center text-gray-500 italic">No commission withdrawals initiated yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* POST / EDIT JOB MODAL */}
      <AnimatePresence>
        {(showPostJobModal || showEditJobModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-[40px] shadow-2xl shadow-purple-900/40 max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 p-8 border-b border-gray-800 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    {showEditJobModal ? <FaEdit className="text-blue-500" /> : <FaPlus className="text-purple-600" />}
                    {showEditJobModal ? "Edit Platform Job" : "Post New Platform Job"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Changes are live immediately upon saving.</p>
                </div>
                <button onClick={() => { setShowPostJobModal(false); setShowEditJobModal(false); setEditingJob(null); }} className="bg-black/50 text-gray-500 hover:text-white p-3 rounded-full transition-colors border border-gray-800">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={showEditJobModal ? handleUpdateJob : handlePostJob} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Project Title</label>
                  <input
                    required
                    className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl p-4 text-white font-bold focus:outline-none transition-all"
                    placeholder="e.g. Critical Platform Security Audit"
                    value={newJobData.title}
                    onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Description</label>
                  <textarea
                    required
                    className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl p-4 text-white font-medium focus:outline-none transition-all min-h-[120px]"
                    placeholder="Detailed project requirements..."
                    value={newJobData.description}
                    onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaLayerGroup className="text-purple-400" /> Category
                    </label>
                    <select
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-purple-600 focus:outline-none transition-all appearance-none cursor-pointer"
                      value={newJobData.category}
                      onChange={(e) => setNewJobData({ ...newJobData, category: e.target.value })}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaBriefcase className="text-purple-400" /> Experience
                    </label>
                    <select
                      className="w-full bg-black border-2 border-gray-800 rounded-2xl p-4 text-white font-bold focus:border-purple-600 focus:outline-none transition-all appearance-none cursor-pointer"
                      value={newJobData.experienceLevel}
                      onChange={(e) => setNewJobData({ ...newJobData, experienceLevel: e.target.value })}
                    >
                      {levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Budget (₹)</label>
                    <input
                      required
                      type="number"
                      className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl p-4 text-white font-black focus:outline-none transition-all"
                      placeholder="5000"
                      value={newJobData.budget}
                      onChange={(e) => setNewJobData({ ...newJobData, budget: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaCalendarAlt className="text-purple-400" /> Deadline
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl p-4 text-white font-bold focus:outline-none transition-all [color-scheme:dark]"
                      value={newJobData.deadline}
                      onChange={(e) => setNewJobData({ ...newJobData, deadline: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={jobPostLoading}
                  className={`w-full ${showEditJobModal ? 'bg-blue-600' : 'bg-purple-600'} text-white py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-black transition-all shadow-xl disabled:opacity-50`}
                >
                  {jobPostLoading ? "Saving..." : (showEditJobModal ? "Update Platform Job" : "Publish Job from Admin Account")}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* PROPOSALS MANAGEMENT MODAL */}
        {showProposalsModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 w-full max-w-4xl rounded-[40px] shadow-2xl shadow-purple-900/40 max-h-[85vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-800 flex justify-between items-center shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <FaUsers className="text-purple-500" /> Manage Proposals
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 truncate max-w-md">Project: {selectedJobProposals?.title}</p>
                </div>
                <button onClick={() => { setShowProposalsModal(false); setSelectedJobProposals(null); }} className="bg-black/50 text-gray-500 hover:text-white p-3 rounded-full transition-colors border border-gray-800">
                  <FaTimes />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                {selectedJobProposals?.proposals?.length === 0 ? (
                  <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-gray-800">
                    <FaExclamationCircle className="text-gray-700 text-4xl mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No proposals received yet.</p>
                  </div>
                ) : (
                  selectedJobProposals?.proposals?.map((p) => (
                    <div key={p._id} className="bg-black/40 border border-gray-800 p-6 rounded-3xl flex flex-col md:flex-row gap-6 hover:border-gray-700 transition-all">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-purple-400 font-black border border-gray-700 text-xl overflow-hidden">
                              {p.freelancer?.profilePicture ? <img src={p.freelancer.profilePicture} className="w-full h-full object-cover" /> : p.freelancer?.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-black text-white text-lg">{p.freelancer?.name}</div>
                              <div className="text-xs text-purple-400 font-bold uppercase tracking-widest">{p.freelancer?.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-white">₹{p.bidAmount?.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Proposed Bid</div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm bg-black/60 p-5 rounded-2xl italic border border-gray-800 mb-6 leading-relaxed">
                          "{p.coverLetter}"
                        </p>

                        <div className="flex gap-4">
                          {p.status === 'pending' || p.status === 'rejected' ? (
                            <>
                              <button
                                onClick={() => handleAcceptProposal(selectedJobProposals._id, p._id)}
                                className="flex-1 bg-white text-black py-4 rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all text-sm uppercase tracking-widest"
                              >
                                {p.status === 'accepted' ? 'Contracted' : 'Accept & Award'}
                              </button>
                              {p.status !== 'rejected' && (
                                <button
                                  onClick={() => handleDeclineProposal(selectedJobProposals._id, p._id)}
                                  className="flex-1 bg-black text-gray-500 py-4 rounded-2xl font-black border border-gray-800 hover:border-red-500 hover:text-red-500 transition-all text-sm uppercase tracking-widest"
                                >
                                  Decline
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="w-full py-4 text-center bg-green-900/20 text-green-400 border border-green-900/50 rounded-2xl font-black uppercase tracking-widest">
                              PROPOSAL ACCEPTED
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* RESPONSE MODAL */}
        {showResponseModal && selectedContact && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-[40px] shadow-2xl shadow-purple-900/40"
            >
              <div className="p-8 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <FaEnvelope className="text-purple-500" /> Respond to Contact Message
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">From: {selectedContact.name} ({selectedContact.email})</p>
                </div>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedContact(null);
                    setResponseText("");
                  }}
                  className="bg-black/50 text-gray-500 hover:text-white p-3 rounded-full transition-colors border border-gray-800"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleRespondToContact} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Original Message</label>
                  <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 text-gray-300 italic">
                    "{selectedContact.message}"
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Your Response</label>
                  <textarea
                    required
                    className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl p-4 text-white font-medium focus:outline-none transition-all min-h-[150px] resize-none"
                    placeholder="Type your response here..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-black transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  <FaPaperPlane /> Send Response
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {/* WITHDRAWAL MODAL */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-gray-900 border border-gray-800 w-full max-w-xl rounded-[3rem] shadow-2xl shadow-purple-900/40 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <div className="p-10 border-b border-gray-800 flex justify-between items-center relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-white flex items-center gap-4">
                    <FaWallet className="text-purple-500" /> Payout Request
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Authorized Admin Withdrawal</p>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="bg-black/50 text-gray-500 hover:text-white p-3 rounded-full transition-colors border border-gray-800"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="p-10 space-y-8 overflow-y-auto">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Amount to Transfer (₹)</label>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Limit: ₹{commissionData.currentBalance?.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-600">₹</span>
                    <input
                      required
                      type="number"
                      max={commissionData.currentBalance}
                      className="w-full bg-black border-2 border-gray-800 focus:border-purple-600 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black text-white focus:outline-none transition-all"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("bank")}
                    className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${withdrawMethod === 'bank' ? 'border-purple-600 bg-purple-600/10' : 'border-gray-800 bg-black hover:border-gray-700'
                      }`}
                  >
                    <FaUniversity className={withdrawMethod === 'bank' ? 'text-purple-400' : 'text-gray-500'} />
                    <span className="font-bold text-xs uppercase tracking-widest">Bank Payout</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("upi")}
                    className={`flex-1 p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${withdrawMethod === 'upi' ? 'border-purple-600 bg-purple-600/10' : 'border-gray-800 bg-black hover:border-gray-700'
                      }`}
                  >
                    <FaMobileAlt className={withdrawMethod === 'upi' ? 'text-purple-400' : 'text-gray-500'} />
                    <span className="font-bold text-xs uppercase tracking-widest">UPI Transfer</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {withdrawMethod === 'bank' ? (
                    <motion.div
                      key="bank"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid gap-4"
                    >
                      <input
                        required
                        type="text"
                        placeholder="Organization Bank Name"
                        value={bankDetails.bankName}
                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none transition-all text-white"
                      />
                      <input
                        required
                        type="text"
                        placeholder="Corporate Account Number"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none transition-all text-white"
                      />
                      <input
                        required
                        type="text"
                        placeholder="IFSC Routing Code"
                        value={bankDetails.ifscCode}
                        onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none transition-all text-white"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      <input
                        required
                        type="text"
                        placeholder="Admin Corporate UPI ID"
                        value={bankDetails.upiId}
                        onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                        className="w-full bg-black border border-gray-800 rounded-xl p-4 font-bold focus:border-purple-600 outline-none transition-all text-white"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-purple-900/10 border border-purple-900/30 p-5 rounded-2xl flex items-start gap-4">
                  <FaShieldAlt className="text-purple-500 mt-1 shrink-0" />
                  <p className="text-[11px] text-purple-200 leading-relaxed font-medium">
                    This withdrawal will be recorded as a platform expenditure. Ensure all details match the official corporate accounts. Payouts are processed via Stripe Connect.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 bg-black border border-gray-800 text-gray-400 py-5 rounded-2xl font-black hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-purple-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-purple-900/40"
                  >
                    Confirm Payout
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

const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-900/20 text-blue-400 border-blue-900/50",
    purple: "bg-purple-900/20 text-purple-400 border-purple-900/50",
    green: "bg-green-900/20 text-green-400 border-green-900/50",
    yellow: "bg-yellow-900/20 text-yellow-400 border-yellow-900/50",
    orange: "bg-orange-900/20 text-orange-400 border-orange-900/50"
  };
  return (
    <div className={`p-8 rounded-[32px] bg-gray-900 border border-gray-800 shadow-xl`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-6 border ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{title}</div>
    </div>
  );
};

export default AdminPanel;
