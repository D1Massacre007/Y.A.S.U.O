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
  const fetchUserChats = async (isNewAccount = false) => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/chat/get", {
        headers: { Authorization: token },
      });

      if (data.success) {
        setChats(data.chats);

        if (isNewAccount) {
          // Force no old chat selected for new account
          setSelectedChat(null);
        } else {
          setSelectedChat(
            (prev) => prev || (data.chats.length > 0 ? data.chats[0] : null)
          );
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!user) return toast("Login to create a new chat");
    try {
      const { data } = await axios.get("/api/chat/create", {
        headers: { Authorization: token },
      });
      if (data.success) {
        await fetchUserChats(true); // fetch chats, mark as new account
        
      }
      navigate("/");
      return data.chat;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Handle login / registration
  const handleLogin = async (loginData) => {
    try {
      setToken(loginData.token);
      localStorage.setItem("token", loginData.token);
      setUser(loginData.user);

      // Clear old chat immediately
      setSelectedChat(null);

      // Fetch chats as new account
      await fetchUserChats(true);

      // Create new chat immediately
      await createNewChat();

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

  // Only fetch chats when user exists
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
