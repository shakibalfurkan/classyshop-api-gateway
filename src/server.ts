import createApp from "./app.js";
import config from "./config/index.js";
import logger from "./utils/logger.js";

async function main() {
  const port = process.env.PORT || config.port;

  try {
    const app = createApp();

    app.listen(port, () => {
      logger.info(`API Gateway is running on port ${port}`);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
  }
}

main();
