import React, { useState, useRef, useEffect } from "react";

export default function SearchBarForUpdate({ label, value, onChange, placeholder, options = [] }) {
  const [inputVal, setInputVal] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const activeIsInput = typeof document !== 'undefined' && document.activeElement === inputRef.current;
    const match = options.find((o) => String(o.value) === String(value));
    if (activeIsInput) return; 
    if (match) setInputVal(match.label);
    else if (typeof value === "string") setInputVal(value || "");
  }, [value, options]);

  useEffect(() => {
    if (suggestions.length > 0) setHighlighted(0);
    else setHighlighted(-1);
  }, [suggestions]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
        setHighlighted(-1);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setInputVal(v);
    const currentlySelected = options.find((o) => String(o.value) === String(value));
    if (currentlySelected && v !== currentlySelected.label) {
      if (onChange) onChange("");
    } else {
      if (onChange) onChange(v);
    }

    if (v.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(v.toLowerCase())
      );
      setSuggestions(filtered);
    }
  };

  const handleSelect = (item) => {
    if (onChange) onChange(item.value);
    setInputVal(item.label);
    setSuggestions([]);
    setHighlighted(-1);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && highlighted < suggestions.length) {
        handleSelect(suggestions[highlighted]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlighted(-1);
    }
  };

  useEffect(() => {
    if (highlighted < 0) return;
    const list = containerRef.current?.querySelector('[role="listbox"]');
    if (!list) return;
    const el = list.querySelector(`[data-index="${highlighted}"]`);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [highlighted]);

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-sm mb-1">{label}</label>}
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 text-sm shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
        value={inputVal}
        placeholder={placeholder || "Search..."}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        aria-haspopup="listbox"
      />

      {suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute w-full border rounded-xl bg-white mt-1 shadow-md max-h-40 overflow-y-auto z-10"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.value}
              data-index={index}
              role="option"
              aria-selected={index === highlighted}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => handleSelect(item)}
              className={`p-2 cursor-pointer ${index === highlighted ? "bg-slate-200" : "hover:bg-gray-200"}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
 
