// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const users = [
      { username: "admin1", password: "1234", role: "admin" },
      { username: "admin2", password: "5678", role: "admin" },
      { username: "user1", password: "6987", role: "user" },
      { username: "user2", password: "5555", role: "user" },
    ];

    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) {
      alert("Invalid credentials");
      return;
    }

    if (found.role === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-gray-200 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="block mb-2 p-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block mb-2 p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}