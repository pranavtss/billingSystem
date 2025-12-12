import React from "react";

export default function PriceInputPair({
  kgValue,
  boxValue,
  onKgChange,
  onBoxChange,
  showLabel = true,
  helperText = "Enter one or both; if both are filled they will be saved together."
}) {
  return (
    <div className="flex flex-col gap-2">
      {showLabel && <label className="text-sm text-gray-600 font-medium">Price</label>}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          placeholder="₹ per kg"
          className="flex-1 min-w-0 border p-2 rounded"
          value={kgValue || ""}
          onChange={onKgChange}
          min="0"
          step="0.01"
        />
        <input
          type="number"
          placeholder="₹ per box"
          className="flex-1 min-w-0 border p-2 rounded"
          value={boxValue || ""}
          onChange={onBoxChange}
          min="0"
          step="0.01"
        />
      </div>
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
