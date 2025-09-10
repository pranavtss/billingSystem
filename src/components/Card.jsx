import React from "react";
export default function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4 w-full">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
