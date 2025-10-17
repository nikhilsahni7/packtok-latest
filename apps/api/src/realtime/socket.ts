import { Server as HttpServer } from "http";
import { DisconnectReason, Server, Socket } from "socket.io";
import config from "../config";
import logger from "../utils/logger";

let io: Server | null = null;

const AUCTION_ROOM_PREFIX = "auction:";

const getAllowedOrigins = () =>
  config.corsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const initSocketServer = (server: HttpServer): Server => {
  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info({ socketId: socket.id }, "Socket connected");

    socket.on("disconnect", (reason: DisconnectReason) => {
      logger.info({ socketId: socket.id, reason }, "Socket disconnected");
    });

    socket.on(
      "auction:join",
      (
        payload: { auctionId?: string },
        acknowledge?: (response: {
          status: "ok" | "error";
          message?: string;
        }) => void
      ) => {
        const auctionId = payload?.auctionId?.trim();
        if (!auctionId) {
          acknowledge?.({ status: "error", message: "auctionId is required" });
          return;
        }
        const room = getAuctionRoomName(auctionId);
        socket.join(room);
        acknowledge?.({ status: "ok" });
      }
    );

    socket.on(
      "auction:leave",
      (
        payload: { auctionId?: string },
        acknowledge?: (response: {
          status: "ok" | "error";
          message?: string;
        }) => void
      ) => {
        const auctionId = payload?.auctionId?.trim();
        if (!auctionId) {
          acknowledge?.({ status: "error", message: "auctionId is required" });
          return;
        }
        const room = getAuctionRoomName(auctionId);
        socket.leave(room);
        acknowledge?.({ status: "ok" });
      }
    );
  });

  return io;
};

export const tryGetSocketServer = (): Server | null => io;

export const getAuctionRoomName = (auctionId: string) =>
  `${AUCTION_ROOM_PREFIX}${auctionId}`;
