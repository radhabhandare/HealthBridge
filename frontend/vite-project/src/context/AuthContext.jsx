import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Add token to all requests
  api.interceptors.request.use(
    (config) => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Set axios default header
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      console.log("Login attempt with:", { email, role });
      
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const userData = response.data;
      console.log("Login response:", userData);

      // Check if role matches
      if (userData.role !== role) {
        throw new Error(`Invalid login portal. You are a ${userData.role}`);
      }

      // Store in localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      
      // Set state
      setUser(userData);
      setToken(userData.token);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Login failed" 
      };
    }
  };

  // Register function
  const register = async (userData, role) => {
    try {
      console.log("Register attempt with:", userData);
      
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        ...userData,
        role,
      });

      const newUser = response.data;
      console.log("Register response:", newUser);

      // Store in localStorage
      localStorage.setItem("token", newUser.token);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // Set axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${newUser.token}`;
      
      // Set state
      setUser(newUser);
      setToken(newUser.token);

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Register error:", error.response?.data || error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  // Helper function to make authenticated requests
  const authRequest = async (method, url, data = null) => {
    try {
      const currentToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      };

      let response;
      if (method === 'get') {
        response = await axios.get(`http://localhost:5000${url}`, config);
      } else if (method === 'post') {
        response = await axios.post(`http://localhost:5000${url}`, data, config);
      } else if (method === 'put') {
        response = await axios.put(`http://localhost:5000${url}`, data, config);
      } else if (method === 'delete') {
        response = await axios.delete(`http://localhost:5000${url}`, config);
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Auth request error (${method} ${url}):`, error.response?.data || error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Request failed" 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    authRequest,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};