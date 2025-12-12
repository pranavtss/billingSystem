import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = "/admin", label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-400 transition"
    >
      {label}
    </button>
  );
}
