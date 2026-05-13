import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import helmet from "helmet";
import http from "http";
import multer from "multer";
import pinoHttp from "pino-http";
import config from "./config";
import { initSocketServer } from "./realtime/socket";
import addressRouter from "./routers/address.routes";
import adminArticleRouter from "./routers/admin.article.routes";
import adminAuctionsRouter from "./routers/admin.auctions.routes";
import adminEmailSubscriptionRouter from "./routers/admin.email-subscription.routes";
import adminInvestmentRouter from "./routers/admin.investment.routes";
import adminNotificationRouter from "./routers/admin.notification.routes";
import adminOrderRouter from "./routers/admin.order.routes";
import adminPodcastRouter from "./routers/admin.podcast.routes";
import adminRouter from "./routers/admin.routes";
import adminServiceRouter from "./routers/admin.services.routes";
import adminSubscriptionRouter from "./routers/admin.subscription.routes";
import adminUserRouter from "./routers/admin.user.routes";
import adminVendorsRouter from "./routers/admin.vendors.routes";
import articleRouter from "./routers/article.routes";
import auctionRouter from "./routers/auction.routes";
import authRouter from "./routers/auth.routes";
import cartRouter from "./routers/cart.routes";
import categoryRouter from "./routers/category.routes";
import contactRouter from "./routers/contact.routes";
import emailSubscriptionRouter from "./routers/email-subscription.routes";
import investmentRouter from "./routers/investment.routes";
import notificationRouter from "./routers/notification.routes";
import orderRouter from "./routers/order.routes";
import podcastRouter from "./routers/podcast.routes";
import productRouter from "./routers/product.routes";
import quoteRouter from "./routers/quote.routes";
import serviceRouter from "./routers/service.routes";
import subscriptionRouter from "./routers/subscription.routes";
import userTrackingRouter from "./routers/user-tracking.routes";
import vendorProductsRouter from "./routers/vendor.products.routes";
import vendorRouter from "./routers/vendor.routes";
import adminReviewRouter from "./routes/admin.review.routes";
import reviewRouter from "./routes/review.routes";
import { auctionStatusUpdater } from "./services/auction-status-updater.service";
import { seedDefaultPlans } from "./services/subscription.service";
import { ApiError } from "./utils/apiError";
import logger from "./utils/logger";

const app: Express = express();

app.use(pinoHttp({ logger }));
// CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3002,http://127.0.0.1:3002
const allowedOrigins = config.corsOrigin.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies to be send
    optionsSuccessStatus: 204, // For legacy browser support
  })
);

app.use(helmet());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/healthcheck", (req: Request, res: Response): void => {
  res.status(200).send("OK");
});

app.get("/api/v1/healthcheck", (req: Request, res: Response): void => {
  res.status(200).send("OK");
});

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/vendors/products", vendorProductsRouter);
app.use("/api/v1/quotes", quoteRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/auctions", auctionRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/admins/services", adminServiceRouter);
app.use("/api/v1/admins/auctions", adminAuctionsRouter);
app.use("/api/v1/admins/orders", adminOrderRouter);
app.use("/api/v1/vendors", vendorRouter);
app.use("/api/v1/admins/vendors", adminVendorsRouter);
app.use("/api/v1/admins/users", adminUserRouter);
app.use("/api/v1/admins/articles", adminArticleRouter);
app.use("/api/v1/admins/podcasts", adminPodcastRouter);
app.use("/api/v1/podcasts", podcastRouter);
app.use("/api/v1/user-tracking", userTrackingRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/investments", investmentRouter);
app.use("/api/v1/admins/investments", adminInvestmentRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admins/notifications", adminNotificationRouter);
app.use("/api/v1/admins/email-subscriptions", adminEmailSubscriptionRouter);
app.use("/api/v1", reviewRouter); // Review routes
app.use("/api/v1/admins/reviews", adminReviewRouter); // Admin review routes
app.use("/api/v1/subscriptions", subscriptionRouter); // Vendor subscription routes
app.use("/api/v1/admins/subscriptions", adminSubscriptionRouter); // Admin plan management
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/email-subscriptions", emailSubscriptionRouter);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    res.status((err as ApiError).statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({
        success: false,
        message:
          "Upload too large. Podcast video max size is 800MB and series cover max size is 5MB.",
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: err.message || "Invalid upload payload",
    });
    return;
  }

  if (err instanceof Error && /valid (video|image) file/i.test(err.message)) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  logger.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

app.use(errorHandler);

export const createHttpServer = () => {
  const server = http.createServer(app);
  initSocketServer(server);
  return server;
};

// Start the HTTP server only when this file is executed directly (e.g. pnpm dev)
if (require.main === module) {
  const port = Number(config.port);
  const server = createHttpServer();
  server.listen(port, async () => {
    logger.info(`API server listening on port ${port}`);

    // Start the auction status updater
    auctionStatusUpdater.start();
    logger.info("Auction status updater started");

    // Seed default vendor plans (idempotent)
    try {
      await seedDefaultPlans();
      logger.info("Default vendor plans seeded");
    } catch (err) {
      logger.error(err, "Failed to seed default vendor plans");
    }
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    auctionStatusUpdater.stop();
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    auctionStatusUpdater.stop();
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });
}

export default app;
