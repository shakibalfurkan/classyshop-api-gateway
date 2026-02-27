import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === "development",
  serviceName: process.env.SERVICE_NAME,
  port: process.env.PORT,

  circuit_breaker_threshold: Number(process.env.CIRCUIT_BREAKER_THRESHOLD) || 5,
  circuit_breaker_timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT) || 60000,
  circuit_breaker_reset_timeout:
    Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT) || 30000,

  proxy_timeout: Number(process.env.PROXY_TIMEOUT) || 30000,

  user_service_url: process.env.USER_SERVICE_URL,

  allowed_origins:
    process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ??
    [],
} as const;
