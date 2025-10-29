import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Chatbox from "./Components/Chatbox";
import Credits from "./Pages/Credits";
import { assets } from "./assets/assets";
import { useAppContext } from "./Context/AppContext";
import "./assets/prism.css";
import Login from "./Pages/Login";
import Loading from "./Pages/Loading";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, theme, loadingUser, chats, setSelectedChat } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Auto-select latest chat when chats update
  useEffect(() => {
  if (user && chats.length > 0) {
    setSelectedChat(chats[0]); // select latest chat
  }
}, [chats, user, setSelectedChat]);


  if (loadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {!isMenuOpen && user && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert z-50"
          onClick={() => setIsMenuOpen(true)}
          alt="Menu"
        />
      )}

      {user ? (
        <div
          className={`relative h-screen w-screen flex transition-colors duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#4a0ca3] via-[#2a1025] to-[#050009] text-white"
              : "bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] text-black"
          }`}
        >
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </div>
      ) : (
        <div
          className={`flex items-center justify-center h-screen w-screen transition-colors duration-500 ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#3a0ca3] via-[#1a1025] to-[#050009]"
              : "bg-gradient-to-b from-[#1f1c2c] to-[#3e2a5a]"
          }`}
        >
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
