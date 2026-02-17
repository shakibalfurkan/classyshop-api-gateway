import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { rateLimit } from "express-rate-limit";
import httpProxy from "express-http-proxy";
import { setupSecurityMiddleware } from "./middlewares/security.js";

function createApp(): Application {
  const app: Application = express();

  setupSecurityMiddleware(app);

  return app;
}

export default createApp;
