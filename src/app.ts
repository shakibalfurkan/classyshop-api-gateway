import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import httpProxy from "express-http-proxy";
import { setupSecurityMiddleware } from "./middlewares/security.js";
import { requestIdMiddleware } from "./middlewares/requestId.js";
import config from "./config/index.js";
import { morganStream } from "./utils/logger.js";
import { circuitBreakerMiddleware } from "./middlewares/circuitBreaker.js";

function createApp(): Application {
  const app: Application = express();

  setupSecurityMiddleware(app);

  app.use(compression());

  app.use(requestIdMiddleware);

  if (config.node_env === "production") {
    app.use(morgan("combined", { stream: morganStream }));
  } else {
    app.use(morgan("dev"));
  }

  // ==========================================
  // 4. CORS CONFIGURATION
  // ==========================================
  // app.use(
  //   cors({
  //     origin: (origin, callback) => {
  //       const allowedOrigins = config.allowed_origins!;

  //       // Allow requests with no origin (mobile apps, Postman, etc.)
  //       if (!origin) return callback(null, true);

  //       if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error("Not allowed by CORS"));
  //       }
  //     },
  //     credentials: true,
  //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //     allowedHeaders: [
  //       "Content-Type",
  //       "Authorization",
  //       "X-Requested-With",
  //       "X-Request-ID",
  //     ],
  //     exposedHeaders: [
  //       "X-Request-ID",
  //       "X-RateLimit-Limit",
  //       "X-RateLimit-Remaining",
  //     ],
  //     maxAge: 86400, // 24 hours
  //   }),
  // );

  // ==========================================
  // 5. RATE LIMITING (Before proxies)
  // ==========================================
  // setupRateLimiting(app);

  // ==========================================
  // 6. CIRCUIT BREAKER (Prevent cascading failures)
  // ==========================================
  app.use(circuitBreakerMiddleware);

  return app;
}

export default createApp;
