import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(false);

  // ✅ Safe parsing from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user"); // cleanup invalid entry
      }
    }
  }, []);

  const login = async (data) => {
  try {
    setLoading(true);
    const res = await API.post("/auth/login", data);

    const userData = res.data.data;

    if (!userData || !userData.token) {
      throw new Error(res.data.message || "Invalid credentials");
    }

    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
    });

    setToken(userData.token);
    setIsAuthenticated(true);

    // ✅ THIS WAS MISSING
    localStorage.setItem("token", userData.token);
    localStorage.setItem(
      "user",
      JSON.stringify({ id: userData.id, name: userData.name, email: userData.email })
    );

    toast.success("Login successful!");
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Login failed");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    return false;
  } finally {
    setLoading(false);
  }
};



  const register = async (data) => {
  try {
    setLoading(true);

    // call backend
    const res = await API.post("/auth/register", data);

    // ✅ Check if response has user & token
 const userData = res.data.data;

if (!userData || !userData.token) {
  throw new Error(res.data.message || "Registration failed");
}

setUser({
  id: userData.id,
  name: userData.name,
  email: userData.email,
});

setToken(userData.token);
setIsAuthenticated(true);

localStorage.setItem("token", userData.token);
localStorage.setItem(
  "user",
  JSON.stringify({ id: userData.id, name: userData.name, email: userData.email })
);


    toast.success("Registration successful!");
    return true; // indicate success
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || "Registration failed");
    console.error("Registration Error:", error);

    // Make sure to clear user if failed
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    return false; // indicate failure
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
