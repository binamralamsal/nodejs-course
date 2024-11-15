const EventEmitter = require("events");

class Logger extends EventEmitter {
  log(message) {
    this.emit("log", message);
  }

  warn(message) {
    this.emit("warn", message);
  }

  error(message) {
    this.emit("error", message);
  }
}

module.exports = Logger;
