import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === "development",
  serviceName: process.env.SERVICE_NAME,
  port: process.env.PORT,

  user_service_url: process.env.USER_SERVICE_URL,

  allowed_origins: process.env.ALLOWED_ORIGINS,
} as const;
