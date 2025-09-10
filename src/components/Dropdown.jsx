import React from "react";
export default function Dropdown({ label, options, value, onChange }) {
  return (
    <div>
      {label && <label className="block text-sm mb-1">{label}</label>}
      <select className="w-full border p-2 rounded" value={value} onChange={(e)=>onChange(e.target.value)}>
        <option value="">-- Select --</option>
        {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}
