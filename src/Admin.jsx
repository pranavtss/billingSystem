import React from "react";

function Admin() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold underline text-center mb-4">Welcome Admin</h1>
        <p className="text-center text-gray-600">You have successfully logged in as an admin.</p>
      </div>
    </div>
  );
}

export default Admin;