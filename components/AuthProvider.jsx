"use client";
import { setLogin, setLogout } from "@/redux/slices/user";
import { createContext, useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(authStatus === "true");
    setIsLoading(false);
  }, []);

  // const login = () => {
  //   localStorage.setItem("isAuthenticated", "true")
  //   setIsAuthenticated(true)
  // }

  async function login(email, password) {
    try {
      console.log("login called ffrom auth prov...");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle response
      if (!res.ok) {
        const errorData = await res.json();
        return errorData;
      }

      const data = await res.json();
      console.log("dispatching...");
      dispatch(setLogin({ token: data.token, ...data.user }));
      return { success: data?.success || false, message: data?.message || "" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    dispatch(setLogout()); // Clear user data in Redux
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
