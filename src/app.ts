import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import httpProxy from "express-http-proxy";
import { setupSecurityMiddleware } from "./middlewares/security.js";
import { requestIdMiddleware } from "./middlewares/requestId.js";

function createApp(): Application {
  const app: Application = express();

  setupSecurityMiddleware(app);

  app.use(compression());

  app.use(requestIdMiddleware);

  return app;
}

export default createApp;
