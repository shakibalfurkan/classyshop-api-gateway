import express, { type Application } from "express";

import morgan from "morgan";
import compression from "compression";

import { setupSecurityMiddleware } from "./middlewares/security.js";
import { requestIdMiddleware } from "./middlewares/requestId.js";
import config from "./config/index.js";
import { morganStream } from "./utils/logger.js";
import { circuitBreakerMiddleware } from "./middlewares/circuitBreaker.js";
import notFoundHandler from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { corsMiddleware, handlePreflight } from "./middlewares/cors.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { registerProxies } from "./middlewares/proxy.js";

function createApp(): Application {
  const app: Application = express();
  app.set("trust proxy", 1);

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

  app.use(globalLimiter);

  app.use(circuitBreakerMiddleware);

  registerProxies(app);

  app.use(notFoundHandler);

  app.use(globalErrorHandler);

  return app;
}

export default createApp;
