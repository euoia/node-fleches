bunyan = require('bunyan');

module.exports = new bunyan({
  name: "node-game",
  src: true,
  streams: [{
    level: "info",
    stream: process.stdout,
    // log INFO and above to stdout
  }, {
    level: "error",
    path: "log/error.log" // log ERROR and above to a file
  }]
});
