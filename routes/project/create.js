var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('templates/project/create', {});
});

module.exports = router;
