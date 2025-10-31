// src/Components/Message.jsx
import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { assets } from "../assets/assets";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python.min";
import "prismjs/components/prism-sql.min";
import "prismjs/components/prism-json.min";
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-c.min";
import "prismjs/components/prism-cpp.min";

import "../index.css";

/* 🧈 Smooth Typewriter Hook */
const useTypewriter = (text, speed = 18, enabled = true) => {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text);
      return;
    }

    let frameId;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      const charsToShow = Math.min(
        text.length,
        Math.floor(elapsed / speed)
      );

      setDisplayed(text.slice(0, charsToShow));

      if (charsToShow < text.length) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [text, speed, enabled]);

  return displayed;
};

const Message = ({ message, isLast }) => {
  const { theme } = useAppContext();
  const messageRef = useRef(null);
  const [highlighted, setHighlighted] = useState(false);

  const isNewMessage =
    message.role === "assistant" &&
    Date.now() - new Date(message.timestamp).getTime() < 5000;

  const typedContent = useTypewriter(message.content, 18, isNewMessage);

  const formattedTime = moment(message.timestamp).fromNow();

  /* Auto-scroll latest message */
  useEffect(() => {
    if (isLast && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isLast]);

  /* Highlight AFTER typing finishes */
  useEffect(() => {
    if (typedContent === message.content && !highlighted) {
      const timer = setTimeout(() => {
        if (messageRef.current) {
          Prism.highlightAllUnder(messageRef.current);
          setHighlighted(true);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [typedContent, message.content, highlighted]);

  /* Re-apply Prism when theme changes or component re-mounts */
  useEffect(() => {
    if (highlighted && messageRef.current) {
      Prism.highlightAllUnder(messageRef.current);
    }
  }, [theme, highlighted, message.content]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  const markdownComponents = {
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "clike";

      if (!inline) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: highlighted ? { duration: 0.5 } : { duration: 0 },
            }}
            className="relative my-3 group"
          >
            <pre className="rounded-md p-4 overflow-x-auto bg-[#1e1e1e] text-white text-sm border border-gray-700">
              <code className={highlighted ? `language-${language}` : ""} {...props}>
                {children}
              </code>
            </pre>
            {highlighted && (
              <button
                onClick={() => copyToClipboard(children)}
                className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition"
              >
                Copy
              </button>
            )}
          </motion.div>
        );
      }

      return (
        <code className="px-1.5 py-0.5 rounded-md text-[0.9rem] font-mono bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
          {children}
        </code>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-3">
        <table className="border-collapse border border-gray-400 dark:border-gray-600 w-full text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-left bg-gray-200 dark:bg-gray-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-400 dark:border-gray-600 px-4 py-2">
        {children}
      </td>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    p: (props) => (
      <p className="mb-3 leading-relaxed text-gray-900 dark:text-gray-100" {...props} />
    ),
    a: (props) => (
      <a
        className="text-purple-600 dark:text-purple-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    ul: (props) => <ul className="mb-3 ml-5 list-disc text-gray-900 dark:text-gray-100" {...props} />,
    ol: (props) => <ol className="mb-3 ml-5 list-decimal text-gray-900 dark:text-gray-100" {...props} />,
    blockquote: (props) => (
      <blockquote className="mb-3 pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-300" {...props} />
    ),
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={messageRef}
        key={message._id ?? message.timestamp}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="my-3"
      >
        {message.role === "user" ? (
          <div className="flex justify-end items-start gap-3">
            <div className="max-w-2xl p-4 sm:p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-sm">
              <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                {message.content}
              </p>
              <p className="text-xs text-gray-500 mt-2 text-right">
                {formattedTime}
              </p>
            </div>
            <img
              src={assets.user_icon}
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
            />
          </div>
        ) : (
          <div className="flex justify-start items-start gap-2">
            <div className="max-w-2xl p-0 sm:p-0">
              <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {typedContent}
              </Markdown>
              <p className="text-xs text-gray-500 mt-2">{formattedTime}</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(Message);
