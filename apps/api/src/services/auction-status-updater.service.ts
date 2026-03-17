import { AuctionStatus, PrismaClient } from "@prisma/client";
import logger from "../utils/logger";
import { finalizeAuction } from "./auction.service";
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

      // Finalize LIVE auctions whose end time has passed.
      // finalizeAuction() computes winners, creates AuctionResult, and sets
      // status to CLOSED in one transaction — so we no longer need a separate
      // updateMany here.
      const toFinalize = await prisma.auction.findMany({
        where: {
          status: AuctionStatus.LIVE,
          endAt: { lte: now },
        },
        select: { id: true },
      });

      if (toFinalize.length > 0) {
        logger.info(`Finalizing ${toFinalize.length} expired auction(s)…`);

        const results = await Promise.allSettled(
          toFinalize.map((a) => finalizeAuction(a.id))
        );

        const succeeded = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failed = results.filter((r) => r.status === "rejected");

        if (succeeded > 0) {
          logger.info(
            `Auto-finalized ${succeeded} auction(s) with winners computed`
          );
        }
        for (const f of failed) {
          if (f.status === "rejected") {
            logger.error("Failed to finalize auction:", f.reason);
          }
        }
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
