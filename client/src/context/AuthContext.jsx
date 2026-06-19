import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchProfile(token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async (currentToken) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      console.log("PROFILE RESPONSE:", res.data);

      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email, password }
    );

    setToken(res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    });

    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      { name, email, password }
    );

    setToken(res.data.token);
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
    });

    return res.data;
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};