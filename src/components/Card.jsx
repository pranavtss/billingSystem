import React from "react";
export default function Card({ title, children }) {
  return (
  <div className="bg-white shadow rounded p-4 w-full max-w-md mx-auto flex flex-col gap-2">
  <h3 className="font-semibold mb-3 text-lg text-center">{title}</h3>
      <div className="space-y-2">{children}</div>
      <style>{`
        @media (max-width: 600px) {
          .card {
            padding: 1rem;
            max-width: 100vw;
          }
        }
      `}</style>
    </div>
  );
}
