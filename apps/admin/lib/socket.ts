import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_PATH = "/socket.io";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  return url;
};

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socket) {
    socket = io(getBaseUrl(), {
      path: SOCKET_PATH,
      transports: ["websocket"],
      withCredentials: true,
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
