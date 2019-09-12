var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:reviewer');

router.use('/projects', require('./reviewer/project/index'));

module.exports = router;
