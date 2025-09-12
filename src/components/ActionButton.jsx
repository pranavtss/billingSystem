import React from "react";

export function DeleteButton({ onClick, children }) {
  return (
    <button
      className="px-2 py-1 bg-red-500 text-white rounded mr-2 hover:bg-red-600"
      onClick={onClick}
    >
      {children || "Delete"}
    </button>
  );
}

export function EditButton({ onClick, children }) {
  return (
    <button
      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {children || "Edit"}
    </button>
  );
}
