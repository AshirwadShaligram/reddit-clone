"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axiosInstance";
import { setCredentials, logout } from "./slice/authSlice";
import LoadingSpinner from "@/components/LoadingSpinner";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        // Attempt to get current user info with credentials
        const response = await api.get(`/api/auth/me`, {
          withCredentials: true,
        });

        if (response.data.user) {
          dispatch(
            setCredentials({
              user: response.data.user,
              isAuthenticated: true,
            })
          );
        }
      } catch (err) {
        console.error("Auth check error:", err.response?.status || err.message);
        // If unauthorized or error, clear auth state
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
