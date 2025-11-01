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

  // Handle OAuth redirect token
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

    try {
      const url = mode === "login" ? "/api/user/login" : "/api/user/register";

      const res = await fetch(SERVER_URL + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (mode === "login") {
        if (data.token) {
          await handleLogin({ token: data.token, user: data.user });
          navigate("/"); // Redirect to main page after login
          window.history.replaceState({}, document.title, "/");
        } else {
          setMessage(data.message || "Login failed. Check your credentials.");
        }
      } else {
        // Registration mode: do NOT show success message
        if (!data.success) {
          setMessage(data.message || "Registration failed.");
        }
        setMode("login"); // Switch to login regardless
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Try again.");
    } finally {
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
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
            <label htmlFor="name" className="mb-1 block text-sm text-gray-400">Name</label>
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
          <label htmlFor="email" className="mb-1 block text-sm text-gray-400">Email</label>
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
          <label htmlFor="password" className="mb-1 block text-sm text-gray-400">Password</label>
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
            <a href="#" className="text-sm text-gray-400 hover:text-purple-400">Forgot Password?</a>
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
            <span onClick={() => setMode("register")} className="text-purple-400 cursor-pointer">Sign Up</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setMode("login")} className="text-purple-400 cursor-pointer">Login</span>
          </>
        )}
      </p>

      <div className="relative my-6 text-center">
        <span className="relative z-10 bg-[#1f1c2c] px-3 text-gray-400">Or continue with</span>
        <div className="absolute top-1/2 left-0 h-px w-2/5 -translate-y-1/2 transform bg-gray-600"></div>
        <div className="absolute top-1/2 right-0 h-2/5 -translate-y-1/2 transform bg-gray-600"></div>
      </div>

      <a
        href={`${SERVER_URL}/api/auth/github`}
        className="flex py-2 w-full items-center justify-center gap-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-900 mb-2"
      >
        {/* Github Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#fff"/>
        </svg>
        Github
      </a>

      <a
        href={`${SERVER_URL}/api/auth/google`}
        className="flex py-2 w-full items-center justify-center gap-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-900"
      >
        {/* Google Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"/>
          <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"/>
        </svg>
        Google
      </a>
    </div>
  );
};

export default Login;
