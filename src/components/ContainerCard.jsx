import React from "react";

export default function ContainerCard({
  title,
  children,
  className = "",
  height = "auto"
}) {
  const heightClass = height === "auto" ? "" : `h-[${height}]`;
  
  return (
    <div className={`bg-white rounded-xl shadow-2xl border-2 border-blue-300 p-6 w-full max-w-md mx-auto flex flex-col gap-3 ${heightClass} overflow-hidden ${className}`}>
      {title && <h3 className="font-bold mb-1 text-lg text-center">{title}</h3>}
      {children}
    </div>
  );
}
