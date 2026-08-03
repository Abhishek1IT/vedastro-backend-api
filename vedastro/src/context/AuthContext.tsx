/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  phone: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await authService.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const requestOtp = async (phone: string) => {
    setError(null);
    try {
      await authService.sendOtp(phone);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      throw err;
    }
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    setError(null);
    try {
      const data = await authService.verifyOtp(phone, otp);
      setUser(data.user);
      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP entered.");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout execution failed:", err);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        requestOtp, 
        loginWithOtp, 
        logout, 
        error, 
        setError 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};