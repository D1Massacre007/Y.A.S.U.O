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

  // Fetch logged-in user info
  const fetchUser = async () => {
    if (!token) return setLoadingUser(false);
    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load user data");
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch chats of logged-in user
  const fetchUserChats = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });
      if (data.success) {
        setChats(data.chats);
        setSelectedChat(
          (prev) => prev || (data.chats.length > 0 ? data.chats[0] : null)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Create new chat (called only once after login)
  const createNewChat = async () => {
    if (!user) return toast("Login to create a new chat");
    try {
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });
      if (data.success) {
        await fetchUserChats();
        toast.success("New chat created!");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // 🌟 Run this only the first time a user logs in (not on refresh)
  const handleLogin = async (loginData) => {
    try {
      // loginData should contain token + user info from backend
      setToken(loginData.token);
      localStorage.setItem("token", loginData.token);
      setUser(loginData.user);

      // ✅ Create chat immediately after successful login
      setTimeout(async () => {
        await createNewChat();
      }, 300);

      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  // Update theme
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Load user when token changes
  useEffect(() => {
    if (token) fetchUser();
    else {
      setUser(null);
      setLoadingUser(false);
    }
  }, [token]);

  // 🌟 Only fetch chats when user exists (no auto create)
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
        handleLogin, // 🌟 new function for login
        loadingUser,
        setLoadingUser,
        fetchUserChats,
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
