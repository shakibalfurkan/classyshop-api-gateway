import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { rateLimit } from "express-rate-limit";
import httpProxy from "express-http-proxy";

function createApp(): Application {
  const app: Application = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
      credentials: true,
    }),
  );
  app.use(morgan("dev"));

  return app;
}

export default createApp;
