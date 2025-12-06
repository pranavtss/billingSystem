import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try{
      const res = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID:id,
          userpassword:password
        })
      });
      const data = await res.json();
      if(data.message === "Login successful" && data.role === "admin"){
        // persist session info
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", id);
        navigate("/admin");
      }
      else if (data.message === "Login successful" && data.role === "user"){
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", id);
        navigate("/user");
      }
      else{
        return alert("Invalid Credentials");
      }
    }
    catch(err){
      console.log(err + "Error in Login");
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
