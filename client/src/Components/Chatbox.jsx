// Chatbox.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from './Message';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const suggestions = [
  "Who is Annaz?",
  "Projects he worked on ?",
  "What is his everyday schedule ?",
  "Describe his Professional Experience?",
  "What is his educational background ?"
];

const Chatbox = () => {
  const containerRef = useRef(null);
  const { selectedChat, theme, user, axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (selectedChat && Array.isArray(selectedChat.messages)) {
      setMessages(selectedChat.messages);
    } else {
      setMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast('Login to send message');
    if (!prompt.trim()) return;

    await sendMessage(prompt);
    setPrompt('');
  };

  const sendMessage = async (text) => {
    setLoading(true);

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
      isImage: false
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data } = await axios.post(
        `/api/message/text`,
        { chatId: selectedChat._id, prompt: text },
        { headers: { Authorization: token } }
      );

      if (data.success) {
        const replyMessage = { ...data.reply, isImage: false };
        setMessages(prev => [...prev, replyMessage]);
        setUser(prev => ({ ...prev, credits: prev.credits - 1 }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (text) => {
    if (!user) return toast('Login to send message');
    setShowSuggestions(false);
    await sendMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-10">

      {/* Messages container */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === 'dark' ? assets.logo_full_1_1 : assets.logo_light}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-700 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message._id || message.timestamp}
            message={message}
          />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {/* Centered "Need a hint?" button */}
      <div className="w-full flex flex-col items-center mb-2 relative">
        <button
          onClick={() => setShowSuggestions(prev => !prev)}
          className="flex items-center gap-2 text-gray-800 dark:text-gray-400 font-semibold hover:text-purple-500 transition z-10"
        >
          Need a hint ?
          <motion.span
            animate={{ rotate: showSuggestions ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="inline-block"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="flex overflow-x-auto gap-2 py-2 px-1 mt-2"
            >
              {suggestions.map((s, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex-shrink-0 px-4 py-2 bg-purple-950 hover:bg-purple-700 text-white rounded-full text-sm transition whitespace-nowrap"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input form */}
      <form
        onSubmit={onSubmit}
        className={`relative w-full flex items-center gap-4 p-3 pl-4
          border border-transparent rounded-full transition-all duration-300
          ${isFocused
            ? theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.1),_transparent)] backdrop-blur-xl border border-purple-500/50 shadow-[0_0_15px_2px_rgba(168,85,247,0.4)]'
              : 'bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md'
            : theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.05),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.03),_transparent)] backdrop-blur-lg border border-white/10'
              : 'bg-white/80 backdrop-blur-sm border border-gray-200'
          }
        `}
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="What do you want to know?"
          className="flex-1 text-sm sm:text-base outline-none bg-transparent text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          required
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="ml-auto relative rounded-full p-1"
        >
          <motion.img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="Send"
            className="w-8 cursor-pointer"
            animate={loading ? { rotate: 360, opacity: 0.8 } : { rotate: 0, opacity: 1 }}
            transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.3 }}
          />
        </motion.button>
      </form>
    </div>
  );
};

export default Chatbox;
