import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export const initSocket = () => {
  return io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    timeout: 20000,
  });
};