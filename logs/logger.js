const log4js = require("log4js");
log4js.configure({
  appenders: {
    console: { type: "console" },
    warnFile: { type: "file", filename: "logs/warn.log" },
    errorFile: { type: "file", filename: "logs/error.log" },
    // logger
    loggerConsole: { type: "logLevelFilter", appender: "console", level: "all" },
    loggerWarnFile: { type: "logLevelFilter", appender: "warnFile", level: "warn" },
    loggerErrorFile: { type: "logLevelFilter", appender: "errorFile", level: "error" },
  },
  categories: {
    default: {
      appenders: ["loggerConsole", "loggerWarnFile", "loggerErrorFile"],
      level: "all",
    },
  },
});
const logger = log4js.getLogger();

class Logger {
  constructor() {}
  logMissingRoute(route) {
    logger.warn(`Route: ${route} does not exist`);
  }

  logInfoRoute(route) {
    logger.info(`Requesting: ${route} from server`);
  }

  logError(error) {
    logger.error(`Error thrown: ${error}`);
  }
}

module.exports = Logger;
