import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../image/logo.png";
import Toast from "../components/Toast";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();
  const showToast = (msg) => setToastMessage(msg);
  
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
  }, []);

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
      
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", id);
        localStorage.setItem("role", data.role);
        navigate("/admin", { replace: true });
      }
      else if (data.message === "Login successful" && data.role === "user"){
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", id);
        localStorage.setItem("role", data.role);
        navigate("/user", { replace: true });
      }
      else{
        showToast("Invalid Credentials");
        return;
      }
    }
    catch(err){
      console.log(err + "Error in Login");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <Toast message={toastMessage} onClose={() => setToastMessage("")} position="top-center" />
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white/95 shadow-[0_25px_60px_-28px_rgba(15,23,42,0.55)] p-8 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <img
            src={logo}
            alt="Lumoryn Billings logo"
            className="w-14 h-14 object-contain"
          />
          <div className="leading-tight">
            <div className="text-2xl font-semibold text-slate-900">Lumoryn Billings</div>
            <div className="text-sm text-slate-500">Fish market billing system</div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 text-center">Sign in</h2>
        <input
          placeholder="User ID"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 mb-3 text-sm shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 mb-4 text-sm shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
