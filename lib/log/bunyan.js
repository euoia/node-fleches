bunyan = require('bunyan');

module.exports = new bunyan({
  name: "node-game",
  src: true,
  streams: [{
    level: "info",
    //stream: process.stdout,
    path: "log/app.log"
    // log INFO and above to stdout
  }, {
    level: "error",
    path: "log/app.log"
  }]
});
