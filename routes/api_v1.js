var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api_v1');

router.use('/admin/projects', require('./api/admin/project/index'));
router.use('/reviewer/projects', require('./api/reviewer/project/index'));
router.use('/project', require('./api/project/index'));
router.use('/project', require('./api/project/presentation'));
router.use('/search', require('./api/search'));
router.use('/email/templates', require('./api/email/configure/index'));

module.exports = router;
