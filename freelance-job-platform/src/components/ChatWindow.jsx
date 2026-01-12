import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ChatWindow = ({ jobId, otherUserId, otherUserName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const endpoint = jobId
                    ? `/messages/${jobId}/${otherUserId}`
                    : `/messages/direct/${otherUserId}`;
                const { data } = await API.get(endpoint);
                setMessages(data);
            } catch (err) {
                console.error("Failed to fetch messages", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [jobId, otherUserId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            let data;
            if (jobId) {
                const res = await API.post("/messages", {
                    jobId,
                    receiverId: otherUserId,
                    content: newMessage,
                });
                data = res.data;
            } else {
                const res = await API.post("/messages/direct", {
                    receiverId: otherUserId,
                    content: newMessage,
                });
                data = res.data;
            }
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const { user } = useAuth();

    return (
        <div className="flex flex-col h-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                    {otherUserName?.charAt(0)}
                </div>
                <div>
                    <h3 className="text-white font-bold">{otherUserName}</h3>
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                {loading ? (
                    <div className="text-center text-gray-400 p-10 uppercase tracking-widest text-xs">Loading conversation...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 p-10 italic">No messages yet. Start a conversation!</div>
                ) : (
                    messages.map((msg) => {
                        const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                        const isMe = senderId.toString() === user?._id?.toString();
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${isMe
                                    ? 'bg-purple-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1 opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-2">
                <input
                    type="text"
                    placeholder="Write a message..."
                    className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none placeholder-black text-black"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-gray-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-purple-600 transition-colors shadow-lg shadow-gray-200"
                >
                    <FaPaperPlane size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
