var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var adaro = require('adaro');
var session = require('express-session');
var passport = require('passport');
var lusca = require('lusca');
var httpError = require('http-errors');

var db = require('./db2/index');
var router = require('./router');

var app = express();
var csrfMiddleware = lusca.csrf();
// view engine setup
app.engine('dust', adaro.dust({
  cache: false,
  helpers: [{
    name: 'dustjs-helpers',
  }]
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: require('./cryptokey.json').sessionsecret,
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (/^\/project\/.*\/upload$/.test(req.originalUrl)) {
    next();
  } else {
    next();
    //csrfMiddleware(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection())
app.use(lusca.nosniff());
app.use(lusca.referrerPolicy('same-origin'));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = httpError(err.status, err.message);;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log('---------- ERROR ----------');
  console.log(err);
  console.log('---------- ERROR ----------');

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
