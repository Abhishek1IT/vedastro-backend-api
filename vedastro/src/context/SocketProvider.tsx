/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";

import { Socket } from "socket.io-client";

import { initSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitEvent: (event: string, data?: any) => void;
}

export const SocketContext = createContext<SocketContextType | null>(null);

let socketInstance: Socket | null = null;

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();

  const { setUserOnline, setUserOffline } = useChatStore();

  const [socket, setSocket] = useState<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("SocketProvider Mounted");

    if (!isAuthenticated || !user?._id) {
      if (socketInstance) {
        socketInstance.removeAllListeners();

        socketInstance.disconnect();

        socketInstance = null;
      }

      setSocket(null);

      setIsConnected(false);

      return;
    }

    if (!socketInstance) {
      socketInstance = initSocket();

      // ======================
      // User Online
      // ======================

      socketInstance.on("user:online", ({ userId }) => {
        setUserOnline(userId);
      });

      // ======================
      // User Offline
      // ======================

      socketInstance.on("user:offline", ({ userId }) => {
        setUserOffline(userId);
      });

      // ======================
      // Connected
      // ======================

      socketInstance.on("connect", () => {
        console.log("Socket Connected:", socketInstance?.id);

        setIsConnected(true);
      });

      // ======================
      // Disconnect
      // ======================

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket Disconnected:", reason);

        setIsConnected(false);
      });

      // ======================
      // Error
      // ======================

      socketInstance.on("connect_error", (error) => {
        console.log("Socket Error:", error.message);
      });

      // ======================
      // Reconnect
      // ======================

      socketInstance.io.on("reconnect_attempt", (attempt) => {
        console.log("Reconnect Attempt:", attempt);
      });

      socketInstance.io.on("reconnect", (attempt) => {
        console.log("Reconnected:", attempt);
      });
    }

    if (!socketInstance.connected) {
      socketInstance.connect();
    }

    setSocket(socketInstance);

    return () => {
      console.log("SocketProvider Cleanup");
    };
  }, [isAuthenticated, user?._id, setUserOnline, setUserOffline]);

  const emitEvent = (event: string, data?: any) => {
    if (socketInstance && socketInstance.connected) {
      socketInstance.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        emitEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
