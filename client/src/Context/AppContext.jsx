// src/Context/AppContext.jsx
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

  // Detect token from URL (OAuth redirect) or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get("token");

    if (tokenFromURL) {
      localStorage.setItem("token", tokenFromURL);
      setToken(tokenFromURL);
      axios.defaults.headers.common["Authorization"] = tokenFromURL;

      // Clean token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        axios.defaults.headers.common["Authorization"] = savedToken;
      }
    }
  }, []);

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
        setSelectedChat((prev) => prev || (data.chats.length > 0 ? data.chats[0] : null));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Create new chat (only triggered by user action)
  const createNewChat = async () => {
    if (!user) return; // silently fail if not logged in
    try {
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });
      if (data.success) {
        await fetchUserChats();
        return data.chat;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Handle login / registration
  const handleLogin = async (loginData) => {
    try {
      setToken(loginData.token);
      localStorage.setItem("token", loginData.token);
      axios.defaults.headers.common["Authorization"] = loginData.token;
      setUser(loginData.user);

      setSelectedChat(null);
      await fetchUserChats(); // fetch chats but do NOT create new chat automatically
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

  // Fetch chats when user exists
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
        handleLogin,
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
