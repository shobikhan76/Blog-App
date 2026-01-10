import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

 
  if (loading) {
    return <div>Loading...</div>;
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
