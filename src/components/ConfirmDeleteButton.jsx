import React, { useState } from "react";

export default function ConfirmDeleteButton({ onConfirm, onCancel, label = "Delete", className = "" }) {
  const [confirming, setConfirming] = useState(false);

  const baseSpacing = "px-2 py-1 rounded text-sm";
  const buttonWidth = "w-[70px]";

  if (!confirming) {
    return (
      <button
        className={`bg-red-500 text-white ${baseSpacing} hover:bg-red-600 transition ${buttonWidth} ${className}`}
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${buttonWidth} ${className} bg-gray-300 rounded p-0.5`}>
      <button
        aria-label="Confirm delete"
        className={`text-white bg-red-500 hover:bg-red-600 transition flex-1 px-1 py-1 rounded flex items-center justify-center`}
        onClick={() => {
          onConfirm?.();
          setConfirming(false);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        aria-label="Cancel delete"
        className={`text-white bg-gray-600 hover:bg-gray-700 transition flex-1 px-1 py-1 rounded flex items-center justify-center`}
        onClick={() => {
          setConfirming(false);
          onCancel?.();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
