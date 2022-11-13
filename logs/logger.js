const log4js = require("log4js");
log4js.configure({
  appenders: {
    loggerAll: { type: "console" },
  },
  categories: { default: { appenders: ["loggerAll"], level: "all" } },
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
