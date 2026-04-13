import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./AuthenticationComponent/Login";
import Signup from "./AuthenticationComponent/Signup";
import UserDashboard from "./UserDashboard/UserDashboard";
import AdminDashboard from "./UserDashboard/AdminDashboard";
import { Navigate } from "react-router-dom";
import ProtectedRoute from './ProtectedRoutes'
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App