import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ className = "", children }) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <button
      onClick={handleLogout}
      className={className || "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"}
    >
      {children || "Logout"}
    </button>
  );
}
