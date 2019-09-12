var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:email');

router.use('/configure', require('./email/configure/index'));


module.exports = router;
