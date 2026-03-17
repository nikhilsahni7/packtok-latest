import { AuctionStatus, PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { notifyAuctionLive } from "./notification.service";

const prisma = new PrismaClient();

export class AuctionStatusUpdater {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private readonly checkInterval = 10000; // Check every 10 seconds

  start() {
    if (this.intervalId) {
      logger.warn("Auction status updater is already running");
      return;
    }

    logger.info("Starting auction status updater");
    this.intervalId = setInterval(() => {
      this.updateAuctionStatuses().catch((error) => {
        logger.error("Error updating auction statuses:", error);
      });
    }, this.checkInterval);

    // Run immediately on start
    this.updateAuctionStatuses().catch((error) => {
      logger.error("Error updating auction statuses:", error);
    });
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info("Stopped auction status updater");
    }
  }

  private async updateAuctionStatuses() {
    const now = new Date();

    try {
      const toGoLive = await prisma.auction.findMany({
        where: {
          status: AuctionStatus.SCHEDULED,
          startAt: {
            lte: now,
          },
          endAt: {
            gt: now,
          },
        },
        select: {
          id: true,
          productId: true,
          product: {
            select: {
              title: true,
            },
          },
        },
      });

      // Update SCHEDULED auctions to LIVE if start time has passed
      const scheduledToLive = await prisma.auction.updateMany({
        where: {
          id: {
            in: toGoLive.map((auction) => auction.id),
          },
        },
        data: {
          status: AuctionStatus.LIVE,
        },
      });

      if (scheduledToLive.count > 0) {
        logger.info(
          `Updated ${scheduledToLive.count} auctions from SCHEDULED to LIVE`
        );

        await Promise.allSettled(
          toGoLive.map((auction) =>
            notifyAuctionLive({
              auctionId: auction.id,
              productId: auction.productId,
              productTitle: auction.product.title,
            })
          )
        );
      }

      // Update LIVE auctions to CLOSED if end time has passed
      const liveToClosed = await prisma.auction.updateMany({
        where: {
          status: AuctionStatus.LIVE,
          endAt: {
            lte: now,
          },
        },
        data: {
          status: AuctionStatus.CLOSED,
        },
      });

      if (liveToClosed.count > 0) {
        logger.info(
          `Updated ${liveToClosed.count} auctions from LIVE to CLOSED`
        );
      }
    } catch (error) {
      logger.error("Failed to update auction statuses:", error);
      throw error;
    }
  }

  // Manual trigger for testing or admin use
  async triggerUpdate() {
    return this.updateAuctionStatuses();
  }
}

export const auctionStatusUpdater = new AuctionStatusUpdater();
