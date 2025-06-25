import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PageNotFound from "./components/PageNotFound";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwt");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
