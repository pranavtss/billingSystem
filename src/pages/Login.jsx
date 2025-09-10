import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ users }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin() {
    // Find user by id and password
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
      localStorage.setItem("role", user.role);
      localStorage.setItem("currentUser", user.id);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          placeholder="User ID"
          className="w-full border p-2 mb-2"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
