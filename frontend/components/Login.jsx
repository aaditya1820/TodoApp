import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4002/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // navigateTo("/");
      toast.success(data.message || "User logged in successfully");
      setTimeout(() => navigateTo("/"), 1000);
      localStorage.setItem("jwt", data.token);
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.errors || "User registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email"
              autoComplete="off"
            />
          </div>
          {/* password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg font-semibold p-3 shadow-md hover:bg-blue-700 hover:shadow-lg transition"
          >
            Login
          </button>
          <p className="mt-4 text-center text-gray-500 text-sm">
            New user?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
              Signup
            </Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
