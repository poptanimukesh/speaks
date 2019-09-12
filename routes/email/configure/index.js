var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:reviewer:project:index');

router.get('/', function(req, res) {
  	res.render('templates/email/configure/index.dust');
});

module.exports = router;
