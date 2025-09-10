import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./Admin";
import User from "./User";


function AllDetails() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Admin Page */}
        <Route path="/admin" element={<Admin />} />

        {/* User Page */}
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AllDetails;
