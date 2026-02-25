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
import logger, { morganStream } from "./utils/logger.js";
import { circuitBreakerMiddleware } from "./middlewares/circuitBreaker.js";
import notFoundHandler from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { corsMiddleware, handlePreflight } from "./middlewares/cors.js";

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

  app.use(corsMiddleware);
  app.options("*", handlePreflight);

  // setupRateLimiting(app);

  app.use(circuitBreakerMiddleware);

  app.use(notFoundHandler);

  app.use(globalErrorHandler);

  return app;
}

export default createApp;
