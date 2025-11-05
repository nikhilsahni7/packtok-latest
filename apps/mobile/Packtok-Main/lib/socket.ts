import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const API_BASE_URL = "https://api.nikhilsahni.xyz";
const SOCKET_PATH = "/socket.io";

export const getSocket = (): Socket | null => {
  if (!socket) {
    socket = io(API_BASE_URL, {
      path: SOCKET_PATH,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("🔴 Socket connection error:", error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
