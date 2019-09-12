var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:admin');

router.use('/projects', require('./admin/project/index'));

module.exports = router;
