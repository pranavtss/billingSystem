import React, { useEffect } from "react";

export default function Toast({ message, type = "success", duration = 4000, onClose, position = "center" }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bg = type === "error" ? "#ef4444" : "#16a34a"; // red-500 or green-600
  const shadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)";

  let wrapperStyle;
  if (position === "center") {
    wrapperStyle = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 9999 };
  } else if (position === "top-center") {
    wrapperStyle = { position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999 };
  } else {
    // default to top-right
    wrapperStyle = { position: "fixed", top: 16, right: 16, zIndex: 9999 };
  }

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          background: bg,
          color: "white",
          padding: "10px 14px",
          borderRadius: 8,
          boxShadow: shadow,
          minWidth: 200,
          textAlign: "left",
          fontWeight: 600,
        }}
        role="status"
        aria-live="polite"
      >
        {message}
      </div>
    </div>
  );
}
