const Logger = require("./logger");

const logger = new Logger();

logger.on("log", (message) => {
  console.log(`LOG: ${message}`);
});

logger.on("warn", (message) => {
  console.log(`WARNING: ${message} written to warnings.log`);
});

logger.on("error", (message) => {
  console.error(`ERROR: ${message}`);
});

logger.log("This is a general log message");
logger.warn("This is a warning message");
logger.error("This is an error message");
