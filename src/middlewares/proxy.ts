import httpProxy from "express-http-proxy";
import type { Request, Response, NextFunction } from "express";
import type { Application } from "express";
import config from "../config/index.js";
import { logger } from "../utils/logger.js";
import { ServiceUnavailableError } from "../errors/AppError.js";

const sharedOptions = {
  timeout: config.proxy_timeout ?? 30_000,

  proxyReqOptDecorator: (proxyReqOpts: any, req: Request) => {
    proxyReqOpts.headers ??= {};

    proxyReqOpts.headers["X-Request-ID"] = req.headers["x-request-id"];
    proxyReqOpts.headers["X-Forwarded-For"] = req.ip;
    proxyReqOpts.headers["X-Real-IP"] = req.ip;
    proxyReqOpts.headers["User-Agent"] = req.headers["user-agent"];

    return proxyReqOpts;
  },

  userResDecorator: (proxyRes: any, proxyResData: any, req: Request) => {
    logger.info("← Proxy response", {
      requestId: req.headers["x-request-id"],
      path: req.originalUrl,
      statusCode: proxyRes.statusCode,
    });

    return proxyResData;
  },

  proxyErrorHandler: (err: Error, _res: Response, next: NextFunction) => {
    logger.error("Proxy error", { message: err.message });
    next(new ServiceUnavailableError());
  },
};

export const buildProxy = (serviceUrl: string): ReturnType<typeof httpProxy> =>
  httpProxy(serviceUrl, {
    ...sharedOptions,

    proxyReqPathResolver: (req: Request) => {
      const path = req.url;
      logger.debug(
        `→ Proxying ${req.method} ${req.originalUrl} → ${serviceUrl}${path}`,
      );
      return path;
    },
  });

export const registerProxies = (app: Application): void => {
  app.use("/auth-service", buildProxy(config.auth_service_url!));
  app.use("/user-service", buildProxy(config.user_service_url!));
  app.use("/payment-service", buildProxy(config.payment_service_url!));
};
