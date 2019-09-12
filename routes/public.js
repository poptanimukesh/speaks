var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:public');

router.use('/2018/symposium', require('./public/symposium/index'));

router.use('/2019/symposium', require('./public/symposium/2019/index'));

module.exports = router;
