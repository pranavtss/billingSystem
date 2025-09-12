import React, { useState } from "react";

export default function SearchBarWithSuggestions({ label, value, onChange, placeholder, options }) {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSelect = (item) => {
    onChange(item.label); // show label in input
    setSuggestions([]);
  };


  return (
    <div className="relative">
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={value}
        placeholder={placeholder || "Search..."}
        onChange={handleChange}
      />
      {suggestions.length > 0 && (
        <ul className="absolute w-full border rounded bg-white mt-1 shadow-md max-h-40 overflow-y-auto z-10">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
