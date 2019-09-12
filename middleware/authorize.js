var authorize = function(role, failureRedirect) {
  return function(req, res, next) {
    if (!req.user) {
      if (failureRedirect) {
        res.redirect(failureRedirect);
      } else {
        var err = new Error('Login to perform action.');
        err.status = 403;
        throw err;
      }
    } else {
      console.log('LOGGED IN');
      console.log(req.user);
      if (req.user.Role == role) {
        next();
      } else {
        if (failureRedirect) {
          res.redirect(failureRedirect);
        } else {
          var err = new Error('Insufficient privileges');
          err.status = 401;
          throw err;
        }
      }
    }
  }
}

module.exports = authorize;
