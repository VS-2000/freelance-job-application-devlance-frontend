import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("userInfo");
      if (!saved || saved === "undefined" || saved === "null") {
        return null;
      }
      const parsed = JSON.parse(saved);
      const userData = parsed?.data && parsed?.success ? parsed.data : parsed;
      return userData || null;
    } catch (err) {
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      const dataToStore = user.data && user.success ? user.data : user;
      localStorage.setItem("userInfo", JSON.stringify(dataToStore));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [user]);

  const refreshUser = async () => {
    if (!user) return;
    try {
      const { data } = await API.get("/users/profile");
      // data.data contains the actual user object from the backend
      const userData = data.data || data;
      setUser(prev => ({ ...prev, ...userData }));
    } catch (err) {
      console.error("User refresh failed", err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
