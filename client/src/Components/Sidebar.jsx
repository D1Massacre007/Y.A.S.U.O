import React, { useState, useEffect } from "react";
import { useAppContext } from "../Context/AppContext";
import { assets, dummyUserData } from "../assets/assets";
import moment from "moment";
import logo_full_1_1 from "../assets/logo_full_1_1.png";
import logoutIcon from "../assets/icons8-logout-64.png";
import userIcon from "../assets/user_icon.svg";

// Helper to generate consistent color from a string (if needed later)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 50%)`;
  return color;
}

// 👤 User Avatar Component
const UserAvatar = ({ user }) => {
  let initialUrl =
    user?.profilePic?.trim() ||
    user?.picture?.trim() ||
    user?.avatar_url?.trim() ||
    "";

  if (initialUrl.startsWith("//")) initialUrl = "https:" + initialUrl;
  const [avatarSrc, setAvatarSrc] = useState(initialUrl);

  useEffect(() => {
    let newUrl =
      user?.profilePic?.trim() ||
      user?.picture?.trim() ||
      user?.avatar_url?.trim() ||
      "";
    if (newUrl.startsWith("//")) newUrl = "https:" + newUrl;
    setAvatarSrc(newUrl);
  }, [user]);

  const handleError = () => setAvatarSrc(null);

  return (
    <img
      src={avatarSrc || userIcon}
      onError={handleError}
      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
      alt="User Avatar"
    />
  );
};

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    theme,
    setTheme,
    chats,
    navigate,
    user,
    setSelectedChat,
    axios,
    setChats,
    fetchUserChats,
    setToken,
    token,
    selectedChat,
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("online");
  const [manual, setManual] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
  };

  const deleteChat = async (e, chatId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    try {
      const { data } = await axios.post(
        "/api/chat/delete",
        { chatId },
        { headers: { Authorization: token } }
      );
      if (data.success) {
        setSelectedChat((prev) => (prev?._id === chatId ? null : prev));
        setChats((prev) => prev.filter((chat) => chat._id !== chatId));
        await fetchUserChats();
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-400 shadow-[0_0_6px_2px_rgba(34,197,94,0.6)]";
      case "idle":
        return "bg-yellow-400 shadow-[0_0_6px_2px_rgba(250,204,21,0.6)]";
      case "Do Not Disturb":
      case "DND":
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
      timeoutId = setTimeout(() => setStatus("idle"), 60000);
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
        setChats((prev) => [data.chat, ...prev]);
        setSelectedChat(data.chat);
        navigate("/");
      }
    } catch (error) {
      console.error("Chat create error:", error.message);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleLogoClick = () => {
    if (window.location.pathname === "/credits") {
      navigate("/");
      setTimeout(() => {
        if (selectedChat) {
          setSelectedChat({ ...selectedChat });
        } else if (chats.length > 0) {
          setSelectedChat(chats[0]);
        }
      }, 150);
    } else if (window.location.pathname === "/") {
      if (selectedChat) {
        setSelectedChat({ ...selectedChat });
      } else {
        setIsMenuOpen(true);
      }
    } else {
      navigate("/");
      setIsMenuOpen(true);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-4
        bg-white/30 dark:bg-black/20 backdrop-blur-md
        border-r border-[#60609F]/30
        transition-transform duration-500 ease-in-out
        absolute left-0 top-0 z-20 md:relative md:translate-x-0
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-3 w-full mb-5 relative cursor-pointer select-none"
      >
        <img
          src={theme === "dark" ? logo_full_1_1 : assets.logo_full_dark}
          className="h-12"
          alt="Logo"
          onError={(e) => (e.currentTarget.src = logo_full_1_1)}
        />
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
        <span className="mr-2 text-xl">+</span>
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
          .map((chat) => {
            const chatTitle =
              chat.messages.length > 0 ? chat.messages[0].content : chat.name;

            return (
              <div
                key={chat._id}
                onClick={() => {
                  navigate("/");
                  setTimeout(() => setSelectedChat(chat), 50);
                  setIsMenuOpen(false);
                }}
                className="p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 
              dark:border-[#80609F]/15 rounded-md cursor-pointer 
              flex justify-between items-center hover:bg-gray-100 dark:hover:bg-[#57317C]/20 transition-all"
              >
                <div>
                  {/* Show truncated title but full prompt on hover */}
                  <p className="truncate w-full" title={chatTitle}>
                    {chatTitle.length > 50
                      ? chatTitle.slice(0, 50) + "..."
                      : chatTitle}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                    {moment(chat.updatedAt).fromNow()}
                  </p>
                </div>
                <img
                  src={assets.bin_icon}
                  className="w-4 cursor-pointer not-dark:invert"
                  alt="Delete"
                  onClick={(e) => deleteChat(e, chat._id)}
                />
              </div>
            );
          })}
      </div>

      {/* Credits */}
      <div
        onClick={() => navigate("/credits")}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 
        rounded-md cursor-pointer hover:scale-103 transition-all"
      >
        <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="Credits" />
        <div className="flex flex-col text-sm">
          <p>Credits : {user?.credits ?? dummyUserData.credits}</p>
          <p className="text-xs text-gray-400">Purchase credits to know more</p>
        </div>
      </div>

      {/* Dark Mode */}
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

      {/* 👤 User Section */}
      <div className="relative flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
        <div className="relative flex-shrink-0">
          <UserAvatar user={user} />
          <span
            onClick={handleStatusClick}
            title="Click to change status"
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white cursor-pointer transition-all duration-500 ease-in-out ${getStatusColor()}`}
          ></span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
        </div>

        {user && (
          <img
            onClick={logout}
            src={logoutIcon}
            className="h-5 cursor-pointer not-dark:invert"
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
