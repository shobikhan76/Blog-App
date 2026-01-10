import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage"; // New Dashboard Page

// Components
import Navbar from "./components/layout/Navbar";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
