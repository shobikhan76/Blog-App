import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo (only visible if user is not logged in) */}
      {!user && (
        <Link to="/" className="text-xl font-bold">
          Blog App
        </Link>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:text-gray-300 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
