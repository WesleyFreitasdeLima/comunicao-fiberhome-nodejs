const winston = require("winston");
const { format, transports } = winston;
const path = require("path");
const util = require("util");

const logFormat = format.printf(
  (info) =>
    `${info.timestamp} ${info.level} [${info.label}]: ${
      typeof info.message === "object"
        ? util.inspect(info.message)
        : info.message
    }`
);

const logger = winston.createLogger({
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: logFormat,
    }),
    new transports.File({
      filename: "logs/warn.log",
      level: "warn",
      format: logFormat,
    }),
    new transports.File({
      filename: "logs/info.log",
      level: "info",
      format: logFormat,
    }),
    new transports.File({
      filename: "logs/debug.log",
      level: "debug",
      format: logFormat,
    }),
  ],
  exitOnError: false,
});
global.console.log = logger.info;
global.console.info = logger.info;
global.console.warn = logger.warn;
global.console.error = logger.error;
module.exports = global.console;
