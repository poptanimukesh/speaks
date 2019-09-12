var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:index');

router.use('/', require('./routes/index'));
router.use('/', require('./routes/login'));
router.use('/', require('./routes/public'));
router.use('/api/v1/', require('./routes/api_v1'));
router.use('/admin', require('./routes/admin'));
router.use('/reviewer', require('./routes/reviewer'));
router.use('/project', require('./routes/project'));
router.use('/email', require('./routes/email'));

module.exports = router;
