import React, { useState, useEffect } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets, dummyUserData } from "../assets/assets";
import moment from "moment";
import logo_full_1_1 from "../assets/logo_full_1_1.png";
import toast from "react-hot-toast";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    theme,
    setTheme,
    chats,
    navigate,
    user,
    setSelectedChat,
    createNewChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
  } = useAppContext();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logged out successfully");
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting...");
    try {
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("online");
  const [manual, setManual] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-400 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]";
      case "idle":
        return "bg-yellow-400 shadow-[0_0_6px_2px_rgba(250,204,21,0.6)]";
      case "Do Not Disturb":
        return "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]";
      default:
        return "bg-gray-400";
    }
  };

  useEffect(() => {
    if (manual) return;
    let timeoutId;
    const handleActivity = () => {
      setStatus("online");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setStatus("idle");
      }, 60000);
    };
    handleActivity();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      clearTimeout(timeoutId);
    };
  }, [manual]);

  const handleStatusClick = () => {
    setManual(true);
    setStatus((prev) =>
      prev === "online" ? "idle" : prev === "idle" ? "Do Not Disturb" : "online"
    );
  };

  const handleCreateChat = async () => {
    if (creatingChat) return;
    setCreatingChat(true);
    try {
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats((prev) => [data.chat, ...prev]); // add new chat to top
        setSelectedChat(data.chat); // select new chat immediately
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5 
      dark:bg-gradient-to-b from-[#212124]/90 to-[#10000]/30 
      border-r border-[#60609F]/90 backdrop-blue-5xl 
      transition-transform duration-500 ease-in-out
      absolute left-0 top-0 z-20 md:relative md:translate-x-0
      ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
    

{/* Logo + Beta */}
<div className="flex items-center gap-3 w-full mb-5 relative">
  <img
    src={theme === "dark" ? logo_full_1_1 : assets.logo_full_dark}
    className="h-12" // logo bigger
    alt="Logo"
  />

  {/* Beta Badge */}
  <span
    className="px-3 py-0.5 text-[9px] font-bold text-white bg-gradient-to-r from-purple-700 to-pink-500/70 
               backdrop-blur-sm rounded-full uppercase tracking-wider shadow-md -ml-4"
    title="Beta Version"
  >
    Beta
  </span>
</div>




      {/* New Chat Button */}
      <button
        onClick={handleCreateChat}
        disabled={creatingChat}
        className={`flex justify-center items-center w-full py-2 mt-2 
        text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] 
        text-sm rounded-md cursor-pointer hover:opacity-90 transition-all ${
          creatingChat ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className="mr-2 text-xl">+</span>{" "}
        {creatingChat ? "Creating..." : "New Chat"}
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md">
        <img src={assets.search_icon} className="w-4 not-dark:invert" alt="" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversations"
          className="text-xs placeholder:text-gray-400 outline-none bg-transparent flex-1"
        />
      </div>

      {/* Recent Chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}
      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0].content
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 
              dark:border-[#80609F]/15 rounded-md cursor-pointer 
              flex justify-between group hover:bg-gray-100 dark:hover:bg-[#57317C]/20 transition-all"
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>
              <img
                src={assets.bin_icon}
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                alt="Delete"
                onClick={(e) => deleteChat(e, chat._id)}
              />
            </div>
          ))}
      </div>

      {/* 💎 Credit Purchases Option */}
      <div
        onClick={() => navigate("/credits")}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 
        rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img
          src={assets.diamond_icon}
          className="w-4.5 dark:invert"
          alt="Credits"
        />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits ?? dummyUserData.credits}</p>
          <p className="text-xs text-gray-400">
            Purchase credits to use quickgpt
          </p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img src={assets.theme_icon} className="w-4 not-dark:invert" alt="" />
          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"}
            onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          />
          <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
          <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
        </label>
      </div>

      {/* User Section */}
      <div
        className="relative flex items-center gap-3 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group"
      >
        <div className="relative">
          <img src={assets.user_icon} className="w-9 rounded-full" alt="User" />
          <span
            onClick={handleStatusClick}
            title="Click to change status"
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white cursor-pointer transition-all duration-500 ease-in-out ${getStatusColor()}`}
          ></span>
        </div>

        <div className="flex-1">
          <p className="text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
        </div>

        {user && (
          <img
            onClick={logout}
            src={assets.logout_icon}
            className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"
            alt="Logout"
          />
        )}
      </div>

      {/* Close Button */}
      <img
        onClick={() => setIsMenuOpen(false)}
        src={assets.close_icon}
        className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        alt="Close"
      />
    </div>
  );
};

export default Sidebar;
