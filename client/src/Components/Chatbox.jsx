import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";
import toast from "react-hot-toast";
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
  "What is his educational background?",
];

const smoothTransition = { type: "spring", stiffness: 100, damping: 20, mass: 0.8 }; // buttery spring

const Chatbox = () => {
  const containerRef = useRef(null);
  const {
    selectedChat,
    setSelectedChat,
    theme,
    user,
    axios,
    token,
    setUser,
    createNewChat,
  } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const renderedMessageIds = useRef(new Set());
  const userScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    renderedMessageIds.current.clear();
    setSelectedChat(null);
    setMessages([]);
  }, [user?._id]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      userScrolling.current = true;
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        userScrolling.current = false;
      }, 800);
    };

    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      renderedMessageIds.current.clear();
      return;
    }

    if (selectedChat.userId === user?._id && selectedChat?.messages) {
      const uniqueMessages = Array.from(
        new Map(selectedChat.messages.map((m) => [m._id ?? m.timestamp, m])).values()
      );
      setMessages(uniqueMessages);
      renderedMessageIds.current = new Set(
        uniqueMessages.map((m) => m._id ?? m.timestamp)
      );

      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [selectedChat, user?._id]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (!userScrolling.current && isAtBottom) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast("Login to send message");
    if (!prompt.trim()) return;
    await sendMessage(prompt.trim());
    setPrompt("");
  };

  const sendMessage = async (text) => {
    setLoading(true);

    const userMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
      isImage: false,
    };

    try {
      let chatId = selectedChat?._id;

      if (!chatId) {
        const newChat = await createNewChat();
        if (!newChat?._id) throw new Error("Failed to create a new chat");

        chatId = newChat._id;
        setSelectedChat(newChat);
        setMessages([]);
        renderedMessageIds.current.clear();
      }

      setMessages((prev) => {
        if (prev.some((m) => (m._id ?? m.timestamp) === userMessage.timestamp))
          return prev;
        const next = [...prev, userMessage];
        renderedMessageIds.current.add(userMessage.timestamp);
        setSelectedChat((prevChat) =>
          prevChat ? { ...prevChat, messages: next } : prevChat
        );
        return next;
      });

      const { data } = await axios.post(
        `/api/message/text`,
        { chatId, prompt: text },
        { headers: { Authorization: token } }
      );

      if (data?.success && data.reply) {
        const fullReply = data.reply.content ?? data.reply.text ?? "No response";
        const replyMessage = {
          role: "assistant",
          content: "",
          _id: data.reply._id ?? `reply-${Date.now()}`,
          timestamp: Date.now(),
          isImage: !!data.reply.isImage,
        };

        setMessages((prev) => {
          if (prev.some((m) => m._id === replyMessage._id)) return prev;
          const next = [...prev, replyMessage];
          renderedMessageIds.current.add(replyMessage._id);
          setSelectedChat((prevChat) =>
            prevChat ? { ...prevChat, messages: next } : prevChat
          );
          return next;
        });

        let i = 0;
        const type = () => {
          if (i < fullReply.length) {
            i++;
            setMessages((prev) =>
              prev.map((m) =>
                m._id === replyMessage._id
                  ? { ...m, content: fullReply.slice(0, i) }
                  : m
              )
            );

            const el = containerRef.current;
            if (el) {
              const isAtBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight < 100;
              if (!userScrolling.current && isAtBottom) {
                el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
              }
            }

            const delay =
              [".", ",", "?", "!"].includes(fullReply[i - 1])
                ? 50 + Math.random() * 50
                : 12 + Math.random() * 8;
            setTimeout(type, delay);
          }
        };
        type();

        setUser((prev) => ({
          ...prev,
          credits: (prev?.credits ?? 0) - 1,
        }));
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
    if (!user) return toast("Login to send message");
    setShowSuggestions(false);
    await sendMessage(text);
  };

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-10 overflow-x-hidden">
      {/* Chat messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-auto relative">
        <AnimatePresence>
          {messages.length === 0 && !loading && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ...smoothTransition, duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ ...smoothTransition, duration: 1.2 }}
                className="text-4xl sm:text-6xl text-center text-gray-700 dark:text-white"
              >
                Ask me anything.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message, i, arr) => (
          <Message
            key={message._id ?? message.timestamp}
            message={message}
            isLast={i === arr.length - 1}
          />
        ))}

        {loading && messages.length > 0 && (
          <div className="loader flex items-center gap-1.5 mt-2 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce" />
            <div
              className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce"
              style={{ animationDelay: "0.12s" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-white animate-bounce"
              style={{ animationDelay: "0.24s" }}
            />
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="w-full flex flex-col items-center mb-2 relative z-10">
        <button
          onClick={() => setShowSuggestions((prev) => !prev)}
          className={`flex items-center gap-2 transition-all duration-300 ${
            theme === "dark"
              ? "text-gray-800 dark:text-gray-400 font-semibold hover:text-purple-300"
              : "text-gray-900 font-normal hover:font-semibold"
          }`}
        >
          Need a hint ?
          <motion.span
            animate={{ rotate: showSuggestions ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
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
              transition={{ ...smoothTransition, duration: 0.5 }}
              className="flex overflow-x-auto overflow-y-hidden gap-2 py-2 px-1 mt-2 w-full max-w-full scrollbar-hide snap-x snap-mandatory"
            >
              {suggestions.map((s, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex-shrink-0 snap-start px-4 py-2 bg-purple-950 hover:bg-purple-700 text-white rounded-full text-sm transition-all duration-300 whitespace-nowrap"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ ...smoothTransition, duration: 0.4 }}
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Section */}
      <form
        onSubmit={onSubmit}
        className={`relative w-full flex items-center gap-5 p-3 pl-4
          border rounded-full transition-[border-color,background-color,box-shadow] duration-500
          ${
            isFocused
              ? theme === "dark"
                ? "bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.05),_transparent)] backdrop-blur-lg border border-purple-400/40 shadow-[0_0_8px_1px_rgba(168,85,100,-1)]"
                : "bg-white/20 backdrop-blur-lg border border-purple-200/30 shadow-[0_0_6px_1px_rgba(168,85,247,0.2)]"
              : theme === "dark"
              ? "bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.05),_transparent),radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.02),_transparent)] backdrop-blur-lg border border-white/10 shadow-[0_0_5px_1px_rgba(168,85,247,0.15)]"
              : "bg-white/10 backdrop-blur-lg border border-gray-200/20 shadow-[0_0_4px_1px_rgba(168,85,247,0.1)]"
          }`}
      >
        {/* Icons */}
        <div className="flex items-center gap-3 ml-2">
          <a
            href="https://github.com/D1Massacre007"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === "dark" ? githubDark : githubLight}
              alt="GitHub"
              className="w-8 h-auto object-contain opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            />
          </a>

          <a
            href="https://leetcode.com/u/D1Massacre/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === "dark" ? leetcodeDark : leetcodeLight}
              alt="LeetCode"
              className="w-6 h-auto object-contain opacity-80 hover:opacity-500 hover:drop-shadow-[0_0_8px_rgba(255,148,0,0.8)]"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/annaz-mus-sakib-074443247/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
          >
            <img
              src={theme === "dark" ? linkedinDark : linkedinLight}
              alt="LinkedIn"
              className="w-6 sm:w-7 h-auto object-contain opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(0,119,181,0.8)]"
            />
          </a>
        </div>

        {/* Input */}
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

        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="ml-auto relative rounded-full p-1"
          transition={smoothTransition}
        >
          <motion.img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt="Send"
            className="w-8 cursor-pointer"
            animate={loading ? { rotate: 360, opacity: 0.8 } : { rotate: 0, opacity: 1 }}
            transition={loading ? { repeat: Infinity, duration: 1.5, ease: "linear" } : { duration: 0.5, ease: "easeOut" }}
          />
        </motion.button>
      </form>
    </div>
  );
};

export default Chatbox;
