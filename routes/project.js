var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:projects');

router.use('/create', require('./project/create'));
router.use('/', require('./project/index'));

module.exports = router;
