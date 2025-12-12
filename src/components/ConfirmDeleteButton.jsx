import React, { useState } from "react";

export default function ConfirmDeleteButton({ onConfirm, onCancel, label = "Delete", className = "" }) {
  const [confirming, setConfirming] = useState(false);

  const baseSpacing = "px-2 py-1 rounded";

  if (!confirming) {
    return (
      <button
        className={`bg-red-500 text-white ${baseSpacing} mr-2 hover:bg-red-600 transition ${className}`}
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        aria-label="Confirm delete"
        className={`bg-red-500 text-white ${baseSpacing} hover:bg-red-600 transition`}
        onClick={() => {
          onConfirm?.();
          setConfirming(false);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        aria-label="Cancel delete"
        className={`bg-gray-300 text-gray-800 ${baseSpacing} hover:bg-gray-400 transition`}
        onClick={() => {
          setConfirming(false);
          onCancel?.();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
