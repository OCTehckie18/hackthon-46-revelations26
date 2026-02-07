import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { user, token } = await authService.register(userData);
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Registration failed");
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
