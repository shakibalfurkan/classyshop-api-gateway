import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import config from "../config/index.js";
import { logger } from "../utils/logger.js";

const ALLOWED_ORIGINS: string[] = config.allowed_origins ?? [];

const ALLOW_ALL = ALLOWED_ORIGINS.includes("*");

const originValidator = (
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
): void => {
  if (!origin) return callback(null, true);

  if (ALLOW_ALL) return callback(null, true);

  if (ALLOWED_ORIGINS.includes(origin)) {
    return callback(null, true);
  }

  logger.warn("CORS: rejected origin", { origin });
  return callback(null, false);
};

export const corsMiddleware = cors({
  origin: originValidator,

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Request-ID",
    "X-Internal-Signature",
  ],

  exposedHeaders: [
    "X-Request-ID",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
    "Retry-After",
  ],

  maxAge: 86400,

  preflightContinue: false,

  optionsSuccessStatus: 200,
});
