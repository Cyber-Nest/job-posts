import winston from "winston";
import path from "path";
import fs from "fs";

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Custom log format for readable console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaString}`;
  })
);

// File log format (JSON format for professional log parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// In non-serverless environments (local dev), also log to local files
if (!isServerless && process.env.NODE_ENV !== "production") {
  try {
    const logDir = path.resolve(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: path.join(logDir, "combined.log"),
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      })
    );
  } catch (err) {
    console.warn("[Logger] Could not create logs directory:", err.message);
  }
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fileFormat,
  transports,
});

export default logger;
