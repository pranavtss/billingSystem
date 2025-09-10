import React from "react";
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      placeholder={placeholder || "Search..."}
      className="w-full border p-2 rounded mb-3"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
    />
  );
}
