import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from './Message';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

import githubLight from "../assets/github.png";
import githubDark from "../assets/github_dark.png";
import leetcodeLight from "../assets/Leetcode.png";
import leetcodeDark from "../assets/leetcode_dark.png";
import linkedinLight from "../assets/linkedin.png";
import linkedinDark from "../assets/linkedin_white.png";

const suggestions = [
  "Who is Annaz?",
  "Projects he worked on?",
  "What is his schedule?",
  "Describe his Work Experience",
  "What is his educational background?"
];

const Chatbox = () => {
  const containerRef = useRef(null);
  const { selectedChat, setSelectedChat, theme, user, axios, token, setUser, createNewChat } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const renderedMessageIds = useRef(new Set());

  // Update messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && Array.isArray(selectedChat.messages)) {
      setMessages(selectedChat.messages);
      renderedMessageIds.current = new Set(selectedChat.messages.map(m => m._id ?? m.timestamp));
      
      // Scroll to bottom when switching to a chat
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    } else {
      setMessages([]);
      renderedMessageIds.current.clear();
    }
  }, [selectedChat]);

  // Scroll when new messages are added, but only if user is near bottom
  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100; // 100px tolerance
      if (isNearBottom) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast('Login to send message');
    if (!prompt.trim()) return;

    await sendMessage(prompt.trim());
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

    let chatId = selectedChat?._id;

    try {
      if (!chatId) {
        const newChat = await createNewChat();
        if (!newChat || !newChat._id) throw new Error("Failed to create a new chat");

        chatId = newChat._id;
        setSelectedChat(newChat);
        setMessages([]);
        renderedMessageIds.current.clear();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        setMessages([userMessage]);
        renderedMessageIds.current.add(userMessage.timestamp);
        setSelectedChat(prevChat => prevChat ? { ...prevChat, messages: [userMessage] } : prevChat);
      } else {
        setMessages(prev => {
          const next = [...prev, userMessage];
          renderedMessageIds.current.add(userMessage.timestamp);
          setSelectedChat(prevChat => prevChat ? { ...prevChat, messages: next } : prevChat);
          return next;
        });
      }

      const { data } = await axios.post(
        `/api/message/text`,
        { chatId, prompt: text },
        { headers: { Authorization: token } }
      );

      if (data?.success && data.reply) {
        const fullReplyContent = data.reply.content ?? data.reply.text ?? "No response";
        const replyMessage = {
          role: 'assistant',
          content: '',
          _id: data.reply._id ?? undefined,
          timestamp: Date.now(),
          isImage: !!data.reply.isImage,
        };

        setMessages(prev => {
          const next = [...prev, replyMessage];
          renderedMessageIds.current.add(replyMessage._id ?? replyMessage.timestamp);
          setSelectedChat(prevChat => prevChat ? { ...prevChat, messages: next } : prevChat);
          return next;
        });

        // ChatGPT-style typing effect
        let index = 0;
        let currentContent = '';

        const typeReply = () => {
          if (index < fullReplyContent.length) {
            currentContent += fullReplyContent[index];
            index++;

            setMessages(prev =>
              prev.map(m =>
                m._id === replyMessage._id && m.role === 'assistant'
                  ? { ...m, content: currentContent }
                  : m
              )
            );

            if (containerRef.current) {
              const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
              const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
              if (isNearBottom) {
                containerRef.current.scrollTo({
                  top: containerRef.current.scrollHeight,
                  behavior: 'smooth',
                });
              }
            }

            const currentChar = fullReplyContent[index - 1];
            const delay =
              currentChar === '.' || currentChar === ',' || currentChar === '?' || currentChar === '!'
                ? 100 + Math.random() * 100
                : 20 + Math.random() * 15;

            setTimeout(typeReply, delay);
          }
        };

        typeReply();

        setUser(prev => ({ ...prev, credits: (prev?.credits ?? 0) - 1 }));
      } else {
        toast.error(data?.message || "Failed to get reply from server");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
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

      {/* Chat messages */}
      <div ref={containerRef} className="mb-5 overflow-y-auto relative">
        <AnimatePresence>
          {messages.length === 0 && !loading && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="text-4xl sm:text-6xl text-center text-gray-700 dark:text-white"
              >
                Ask me anything.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <Message
            key={message._id ?? message.timestamp}
            message={message}
            animate={!renderedMessageIds.current.has(message._id ?? message.timestamp)}
          />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce" style={{ animationDelay: '0.12s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce" style={{ animationDelay: '0.24s' }} />
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="w-full flex flex-col items-center mb-2 relative z-10">
        <button
          onClick={() => setShowSuggestions(prev => !prev)}
          className={`flex items-center gap-2 transition ${
      theme === "dark"
        ? "text-gray-800 dark:text-gray-400 font-semibold hover:text-purple-300"
        : "text-gray-900 font-normal dark:text-gray-900 hover:font-semibold hover:text-gray-900"
    }`}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="flex overflow-x-auto gap-2 py-2 px-1 mt-2"
            >
              {suggestions.map((s, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex-shrink-0 px-4 py-2 bg-purple-950 hover:bg-purple-700 text-white rounded-full text-sm transition whitespace-nowrap"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 300, damping: 20 }}
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Form with GitHub + LeetCode + LinkedIn */}
      <form
        onSubmit={onSubmit}
        className={`relative w-full flex items-center gap-5 p-3 pl-4
          border rounded-full transition-[border-color,background-color,box-shadow] duration-300
          ${isFocused
            ? theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.1),_transparent)] backdrop-blur-xl border border-purple-500/50 shadow-[0_0_15px_2px_rgba(168,85,247,0.6)]'
              : 'bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md'
            : theme === 'dark'
              ? 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.05),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.03),_transparent)] backdrop-blur-lg border border-white/10'
              : 'bg-white/80 backdrop-blur-sm border border-gray-200'
          }
        `}
      >
        {/* GitHub + LeetCode + LinkedIn Icons with hover glows */}
        <div className="flex items-center gap-3 ml-2">
          <a
            href="https://github.com/D1Massacre007"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === 'dark' ? githubDark : githubLight}
              alt="GitHub"
              className="w-6 sm:w-8 h-auto object-contain opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            />
          </a>

          <a
            href="https://leetcode.com/u/D1Massacre/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === 'dark' ? leetcodeDark : leetcodeLight}
              alt="LeetCode"
              className="w-6 sm:w-6 h-auto object-contain opacity-80 hover:opacity-500 hover:drop-shadow-[0_0_8px_rgba(255,148,0,0.8)]"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/annaz-mus-sakib-074443247/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === 'dark' ? linkedinDark : linkedinLight}
              alt="LinkedIn"
              className="w-6 sm:w-7 h-auto object-contain opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(0,119,181,0.8)]"
            />
          </a>
        </div>

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
