// This project was created by James Pickard on Sunday 25th November 2012 with
// the following command:
// express --sessions --ejs --css less
var express = require('express'),
  routes = require('./routes'),
  account = require('./routes/account'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path'),
  log = require('log');

var app = express();

app.configure(function() {
  // Choose the logging engine.
  app.set('log engine', 'bunyan');

  // Pre-defined configuration.
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  // Middleware.
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);

  app.use(require('less-middleware')({
    src: __dirname + '/public'
  }));

  app.use(express.static(path.join(__dirname, 'public')));
});

// Settings for development mode.
app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/accounts', account.add);

log.init(app.get('log engine'));

http.createServer(app).listen(app.get('port'), function() {
  log.info("Express server listening on port " + app.get('port'));
});
