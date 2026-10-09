import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";
import { logger } from "./src/utils/logger.js";

async function startServer() {
  try {
    // Connect Database
    await connectDB();

    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Backend Running on http://localhost:${PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

startServer();
