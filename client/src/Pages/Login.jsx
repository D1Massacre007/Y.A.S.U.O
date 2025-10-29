import React, { useState } from "react";
import { useAppContext } from "../Context/AppContext";
import Logo from "../assets/logo.svg";
import toast from "react-hot-toast";

const Login = () => {
  const { setToken, axios } = useAppContext();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = mode === "login" ? "/api/user/login" : "/api/user/register";

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token); // AppContext fetches user automatically
        toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="w-full max-w-sm rounded-lg bg-[#1f1c2c] border border-gray-700 p-4 mx-2 text-white">
      <div className="py-4 flex justify-center">
        <a href="/">
          <img src={Logo} alt="QuickGPT Logo" width="45" height="45" loading="lazy" />
        </a>
      </div>

      <h1 className="mb-4 text-center text-2xl font-semibold text-purple-400">Y.A.S.U.O</h1>

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

        <button
          type="submit"
          disabled={loading}
          className={`py-2.5 font-medium w-full rounded bg-purple-700 text-white transition-colors duration-300 hover:bg-purple-800 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
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
    </div>
  );
};

export default Login;
