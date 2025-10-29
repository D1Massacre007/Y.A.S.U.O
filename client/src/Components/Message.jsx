// src/Components/Message.jsx
import React, { useLayoutEffect } from "react";
import moment from "moment";
import { assets } from "../assets/assets";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";
import { useAppContext } from "../Context/AppContext"; // ✅ Context for theme

// ✅ Import Prism themes and languages
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-python.min";
import "prismjs/components/prism-sql.min";
import "prismjs/components/prism-json.min";
import "prismjs/components/prism-java.min";
import "prismjs/components/prism-c.min";
import "prismjs/components/prism-cpp.min";

import "../index.css"; // ✅ Hybrid light/dark theme variables

const Message = ({ message }) => {
  const { theme } = useAppContext();

  // ✅ Prism syntax highlighting runs right after DOM updates, before paint
  useLayoutEffect(() => {
    Prism.highlightAll();
  }, [message.content, theme]);

  const markdownComponents = {
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-3">
        <table
          className="min-w-full border border-gray-400 dark:border-gray-700 rounded-lg text-sm shadow-sm"
          {...props}
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead className="bg-gray-200 dark:bg-gray-700" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th
        className="border border-gray-500 dark:border-gray-600 px-3 py-2 font-semibold text-left text-gray-800 dark:text-gray-200"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td
        className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-gray-700 dark:text-gray-300"
        {...props}
      />
    ),

    // ✅ Syntax-highlighted code blocks
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "clike";

      if (!inline) {
        return (
          <pre
            className={`rounded-lg p-3 overflow-x-auto my-3 text-sm shadow-inner border 
              bg-[var(--code-bg)] text-[var(--code-text)] border-gray-300 dark:border-gray-700`}
          >
            <code className={`language-${language}`} {...props}>
              {children}
            </code>
          </pre>
        );
      } else {
        return (
          <code
            className={`px-1.5 py-0.5 rounded text-sm font-mono 
              bg-gray-200 text-gray-800 
              dark:bg-gray-700 dark:text-gray-100`}
            {...props}
          >
            {children}
          </code>
        );
      }
    },

    // ✅ Paragraphs, Lists, and Quotes
    p: ({ node, ...props }) => (
      <p className="mb-2 leading-relaxed text-gray-800 dark:text-gray-200" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc list-inside mb-2 pl-4 text-gray-800 dark:text-gray-200" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal list-inside mb-2 pl-4 text-gray-800 dark:text-gray-200" {...props} />
    ),
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-purple-500 pl-3 italic text-gray-700 dark:text-gray-300 my-2"
        {...props}
      />
    ),
  };

  const formattedTime = moment(message.timestamp).fromNow();

  return (
    <div className="my-4">
      {message.role === "user" ? (
        // 🧍‍♂️ User Message
        <div className="flex justify-end items-start gap-2">
          <div className="max-w-2xl p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
            <p className="text-sm leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {message.content}
            </p>
            <p className="text-xs text-gray-500 mt-1 text-right">{formattedTime}</p>
          </div>
          <img
            src={assets.user_icon}
            alt="User"
            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
          />
        </div>
      ) : (
        // 🤖 Assistant Message
        <div className="flex justify-start items-start">
          <div className="max-w-2xl p-3 bg-purple-50 dark:bg-[#4A2F74]/40 rounded-lg border border-purple-300 dark:border-purple-700 shadow-sm">
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </Markdown>
            <p className="text-xs text-gray-500 mt-1">{formattedTime}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ Prevent unnecessary re-renders
export default React.memo(Message);
