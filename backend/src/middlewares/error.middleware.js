import { errorResponse } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`[Error Middleware] ${message}`, {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
  });

  return errorResponse(res, message, statusCode);
}
