import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ✅ Fetch logged-in user info
  const fetchUser = async () => {
    if (!token) {
      setLoadingUser(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
        handleLogout();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
      handleLogout();
    } finally {
      setLoadingUser(false);
    }
  };

  // ✅ Fetch user's chats (only after user is loaded)
  const fetchUserChats = async () => {
    if (!token || !user) return;

    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setChats(data.chats);
        if (data.chats.length > 0) {
          setSelectedChat(data.chats[0]);
        } else {
          setSelectedChat(null);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load chats");
    }
  };

  // ✅ Create new chat when typing first message
  const createNewChat = async () => {
    if (!user) {
      toast.error("Please login first.");
      return null;
    }

    try {
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });

      if (data.success && data.chat) {
        const newChat = data.chat;
        setChats((prev) => [newChat, ...prev]);
        setSelectedChat(newChat);
        return newChat;
      } else {
        toast.error(data.message || "Failed to create chat");
        return null;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return null;
    }
  };

  // ✅ Logout handler — clears everything
  const handleLogout = () => {
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // ✅ Theme setup
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ✅ Watch for token change (login/logout)
  useEffect(() => {
    // When token changes, reset chats immediately to prevent showing old data
    setChats([]);
    setSelectedChat(null);
    setUser(null);

    if (token) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [token]);

  // ✅ Once user is loaded, fetch their chats
  useEffect(() => {
    if (user) fetchUserChats();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        navigate,
        createNewChat,
        fetchUserChats,
        handleLogout,
        loadingUser,
        token,
        setToken,
        axios,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
