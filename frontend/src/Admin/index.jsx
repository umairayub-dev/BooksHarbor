import React from "react";
import Sidebar from "./components/Sidebar.jsx";
import Products from "./pages/Products.jsx";
import Users from "./pages/Users.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Categories from "./pages/Categories.jsx";
import Publishers from "./pages/Publishers.jsx";
import Reviews from "./pages/Reviews.jsx";
import Orders from "./pages/Orders.jsx";

export default function Admin() {
  return (
    <div
      className="row m-0 p-0 min-vh-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="col-md-3 m-0 p-0">
        <Sidebar />
      </div>
      <div className="col-md-9 p-0">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={"/admin-panel/dashboard"} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/books" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />

          <Route
            path="*"
            element={<Navigate to={"/admin-panel/dashboard"} />}
          />
        </Routes>
      </div>
    </div>
  );
}
