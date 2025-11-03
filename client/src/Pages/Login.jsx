import React, { useState, useEffect } from "react";
import { useAppContext } from "../Context/AppContext";
import Logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setToken, handleLogin } = useAppContext();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Handle OAuth redirect token (kept in case future OAuth added)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      localStorage.setItem("token", token);

      handleLogin({ token, user: null }).then(() => {
        navigate("/"); // Redirect to homepage
        window.history.replaceState({}, document.title, "/"); // Clear token from URL
      });
    }
  }, [navigate, setToken, handleLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const isLogin = mode === "login";
    const url = isLogin ? "/api/user/login" : "/api/user/register";

    try {
      const res = await fetch(SERVER_URL + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (isLogin) {
        if (data.token) {
          await handleLogin({ token: data.token, user: data.user });
          navigate("/");
          window.history.replaceState({}, document.title, "/");
          setEmail("");
          setPassword("");
        } else {
          setMessage(data.message || "Login failed. Check your credentials.");
          setPassword("");
        }
      } else {
        if (data.success) {
          setName("");
          setPassword("");
          setMode("login");
        } else {
          setMessage(data.message || "Registration failed. Try a different email.");
          setPassword("");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. The server may be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-[#1f1c2c] border border-gray-900 p-4 mx-2 text-white">
      <div className="py-4 flex justify-center">
        <a href="/">
          <img src={Logo} alt="QuickGPT Logo" width="45" height="45" loading="lazy" />
        </a>
      </div>

      <h1 className="mb-4 text-center text-2xl font-semibold text-gray-400">Y.A.S.U.O</h1>

      {message && <p className="text-center text-red-400 mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm text-gray-400">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-2 w-full rounded border border-gray-600 bg-[#2b2540] px-2 text-center text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm text-gray-400">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-2 w-full rounded border border-gray-600 bg-[#2b2540] px-2 text-center text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm text-gray-400">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-2 w-full rounded border border-gray-600 bg-[#2b2540] px-2 text-center text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        {mode === "login" && (
          <div className="mb-2 text-right">
            <a href="#" className="text-sm text-gray-400 hover:text-purple-400">
              Forgot Password?
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`py-2.5 font-medium w-full rounded bg-purple-700 text-white transition-colors duration-300 hover:bg-purple-800 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <span onClick={() => setMode("register")} className="text-purple-400 cursor-pointer">
              Sign Up
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setMode("login")} className="text-purple-400 cursor-pointer">
              Login
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default Login;
