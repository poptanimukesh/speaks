var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:login');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var UserModel = require('../models2/user');
var authorize = require('../middleware/authorize');

passport.use(new LocalStrategy(
  function(username, password, done) {
    var userModel = new UserModel();
    var data = {
      UserID: username,
      Password: password,
    };
    userModel.authenticate(data)
    .then(function(result) {
      console.log('authenticatedResult');
      console.log(result);
      if (!result.authenticated) {
        return done(null, false);
      } else {
        return done(null, result);
      }
    }).catch(function(err) {
      return done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.get('/admin/login', function(req, res, next) {
  res.render('templates/login', {});
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/admin/login' }), function(req, res, next) {
  console.log(req.user.Role== 'Reviewer');
  if(req.user.Role == 'Reviewer') {
    res.redirect('/reviewer/projects');
  } else{
    res.redirect('/admin/projects');
  }
});

router.get('/jellywhitenull/signup', authorize('Admin', '/admin/login'), function(req, res, next) {
  var userModel = new UserModel();
  var data = {
    UserID: req.query.username,
    Password: req.query.password,
    Role: req.query.role
  };
  userModel.insert(data)
  .then(function(result) {
    res.json({
      status: 'success',
      data: result
    });
  }).catch(function(err) {
    res.json({
      status: 'failure',
      error: err
    });
  });
});

router.get('/jellywhitenull/logincheck', function(req, res, next) {
  var userModel = new UserModel();
  var data = {
    username: req.query.username,
    password: req.query.password,
  };
  userModel.authenticate(data, function(err, result) {
    if (err) {
      res.json({
        status: 'failure',
        error: err
      });
    } else {
      res.json({
        status: 'success',
        data: result
      });
    }
  });
})

module.exports = router;
