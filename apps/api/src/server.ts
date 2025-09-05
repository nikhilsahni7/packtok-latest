import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
} from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import config from "./config";
import adminRouter from "./routers/admin.routes";
import adminServiceRouter from "./routers/admin.services.routes";
import adminVendorsRouter from "./routers/admin.vendors.routes";
import authRouter from "./routers/auth.routes";
import categoryRouter from "./routers/category.routes";
import productRouter from "./routers/product.routes";
import quoteRouter from "./routers/quote.routes";
import serviceRouter from "./routers/service.routes";
import vendorRouter from "./routers/vendor.routes";
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
    credentials: true, // Allow cookies to be sent
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

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/quotes", quoteRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/admins/services", adminServiceRouter);
app.use("/api/v1/vendors", vendorRouter);
app.use("/api/v1/admins/vendors", adminVendorsRouter);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    res.status((err as ApiError).statusCode).json({
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

// Start the HTTP server only when this file is executed directly (e.g. pnpm dev)
if (require.main === module) {
  const port = Number(config.port);
  app.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
  });
}

export default app;
