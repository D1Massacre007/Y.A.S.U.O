import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from "../Context/AppContext";
import { assets } from "../assets/assets";
import Message from './Message';

const Chatbox = () => {
  const containerRef = useRef(null);
  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // track focus

  const onSubmit = async (e) => {
    e.preventDefault();
  };

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

  return (
    <div className="flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40">
      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-primary">
            <img
              src={theme === 'dark' ? assets.logo_full_1_1 : ''}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-500 dark:text-white">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.length > 0 && messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === 'image' && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Publish Generated Image to Community</p>
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </label>
      )}

      {/* Prompt Input Box (Glassmorphism + Focus Glow) */}
      <form
        onSubmit={onSubmit}
        className={`
          relative w-full max-w-2xl mx-auto flex items-center gap-4 p-3 pl-4
          border border-transparent rounded-full transition-all duration-300
          ${isFocused
            ? 'bg-white/15 dark:bg-white/10 backdrop-blur-xl border border-purple-500/50 shadow-[0_0_15px_2px_rgba(168,85,247,0.4)]'
            : 'bg-white/10 dark:bg-[#583C79]/20 backdrop-blur-lg border border-white/10'
          }
        `}
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none bg-transparent text-gray-800 dark:text-gray-200"
        >
          <option className="dark:bg-purple-900" value="text">Text</option>
          <option className="dark:bg-purple-900" value="image">Image</option>
        </select>

        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder="What do you want to know?"
          className="flex-1 w-full text-sm outline-none bg-transparent text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          required
        />

        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-8 cursor-pointer"
            alt=""
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
