import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaPaperPlane, FaTimes, FaCommentDots } from "react-icons/fa";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your Dev Lance assistant. How can I help you today?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const simulateResponse = (userText) => {
        setIsTyping(true);
        setTimeout(() => {
            let responseText = "I'm not sure about that. Try asking about 'jobs', 'posting', or 'pricing'.";
            const lowerText = userText.toLowerCase();

            if (lowerText.includes("hello") || lowerText.includes("hi")) {
                responseText = "Hi there! Ready to find some great work?";
            } else if (lowerText.includes("job") || lowerText.includes("work")) {
                responseText = "You can browse thousands of jobs on our Dashboard. Use the filters to find your perfect match!";
            } else if (lowerText.includes("post") || lowerText.includes("hire")) {
                responseText = "Looking to hire? Click 'Post a Job' in the header to get started. It only takes a few minutes.";
            } else if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("money")) {
                responseText = "We take a small commission on successful projects. Posting a job is completely free!";
            } else if (lowerText.includes("help") || lowerText.includes("support")) {
                responseText = "You can contact our human support team at support@devlance.com.";
            } else if (lowerText.includes("bye")) {
                responseText = "Goodbye! Happy coding!";
            }

            setMessages((prev) => [
                ...prev,
                { id: Date.now(), text: responseText, sender: "bot" }
            ]);
            setIsTyping(false);
        }, 1500);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMsg]);
        simulateResponse(input);
        setInput("");
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-80 md:w-96 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-black p-4 border-b border-gray-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/30">
                                    <FaRobot className="text-white text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">DevBot</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-gray-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="text-gray-400 hover:text-white transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95 scrollbar-thin scrollbar-thumb-gray-700">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                                                ? "bg-purple-600 text-white rounded-br-none"
                                                : "bg-black border border-gray-800 text-gray-300 rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-black border border-gray-800 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={sendMessage} className="p-3 bg-black border-t border-gray-800 flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-900 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-purple-600 placeholder:text-gray-600 transition-all border border-gray-800"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/20"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-2xl shadow-purple-600/40 flex items-center justify-center text-2xl z-[100] border-2 border-white/10 hover:border-white/20 transition-all"
            >
                {isOpen ? <FaTimes /> : <FaCommentDots />}
            </motion.button>
        </>
    );
};

export default ChatBot;
