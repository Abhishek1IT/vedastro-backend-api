"use client";

import { useContext } from "react";
import { SocketContext } from "../context/SocketProvider";

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be inside SocketProvider");
  }

  return context;
};
