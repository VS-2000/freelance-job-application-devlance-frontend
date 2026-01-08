import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import ChatWindow from "../components/ChatWindow";
import { FaInbox, FaCommentDots } from "react-icons/fa";

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInbox = async () => {
            try {
                const { data } = await API.get("/messages/inbox");
                setConversations(data);
                if (data.length > 0 && !selectedChat) {
                    // Automatically select the first one?
                }
            } catch (err) {
                console.error("Failed to fetch inbox", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInbox();
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <div className="w-full px-4 md:px-10 py-10 flex flex-col md:flex-row gap-8 h-[calc(100vh-100px)]">

                {/* Conversations List */}
                <aside className="md:w-96 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-800">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-2xl font-black text-white flex items-center gap-3"
                        >
                            <FaInbox className="text-purple-600" /> Messages
                        </motion.h2>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
                        {loading ? (
                            <div className="p-10 text-center animate-pulse text-gray-500">Loading inbox...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 italic">Your inbox is empty.</div>
                        ) : (
                            conversations.map((conv, idx) => {
                                const isSelected = selectedChat?.otherUser?._id === conv.otherUser._id &&
                                    ((!selectedChat?.job && !conv.job) || (selectedChat?.job?._id === conv.job?._id));

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedChat(conv)}
                                        className={`w-full text-left p-6 border-b border-gray-800 transition-all ${isSelected ? 'bg-purple-900/40 border-l-4 border-l-purple-500' : 'hover:bg-black/30'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`font-bold truncate max-w-[150px] ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                {conv.otherUser.role === 'admin' ? 'Admin Support' : conv.otherUser.name}
                                            </span>
                                            <span className={`text-[10px] ${isSelected ? 'text-purple-300' : 'text-gray-500'}`}>
                                                {new Date(conv.time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={`text-xs font-medium mb-2 ${isSelected ? 'text-purple-300' : 'text-purple-500'}`}>
                                            {conv.job ? `Project: ${conv.job.title}` : <span className="text-blue-400 italic">Direct Message</span>}
                                        </div>
                                        <p className={`text-sm line-clamp-1 italic ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                                            {conv.lastMessage}
                                        </p>
                                        {conv.unread && <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 animate-pulse"></div>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Chat Window */}
                <main className="flex-1 h-full">
                    {selectedChat ? (
                        <div className="h-full bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
                            <ChatWindow
                                jobId={selectedChat.job?._id || null}
                                otherUserId={selectedChat.otherUser._id}
                                otherUserName={selectedChat.otherUser.role === 'admin' ? 'Admin Support' : selectedChat.otherUser.name}
                            />
                        </div>
                    ) : (
                        <div className="h-full bg-gray-900 border border-gray-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-gray-500 shadow-inner">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 border border-gray-800">
                                <FaCommentDots size={40} className="text-gray-700" />
                            </div>
                            <motion.h3
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-xl font-bold text-gray-300 mb-2"
                            >
                                Select a conversation
                            </motion.h3>
                            <p className="max-w-xs text-center text-gray-600">Open a message from the list to start chatting with your client or freelancer.</p>
                        </div>
                    )}
                </main>

            </div>
        </div>
    );
};

export default Messages;
