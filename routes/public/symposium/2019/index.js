var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:public:symposium');

router.get('/projects', function(req, res) {
  res.render('templates/public/symposium/2019/index.dust');
});

module.exports = router;
