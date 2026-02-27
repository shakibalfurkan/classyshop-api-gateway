import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import { logger } from "../utils/logger.js";
import { TooManyRequestsError } from "../errors/AppError.js";

const onLimitReached = (req: Request, res: Response): void => {
  logger.warn("Rate limit exceeded", {
    ip: req.ip,
    path: req.path,
    method: req.method,
    requestId: req.headers["x-request-id"],
    retryAfter: res.getHeader("Retry-After"),
  });

  throw new TooManyRequestsError(
    "Too many requests. Please slow down and try again later.",
  );
};

export const globalLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: onLimitReached,
});
