var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api_v1');

var EmailFindModel = require('../../../../models2/email/find');

var EmailModel = require('../../../../send-email');
var emailModel = new EmailModel();

router.get('/', function(req, res) {
  var emailFindModel = new EmailFindModel();
  emailFindModel.findAll().then(function(results) {
    //var result = legacyProjectHelperModel.legacyFormatWithMetaProjectsSync(results);
    res.json({
        status: 'success',
        message: 'All templates fetched',
        data: results,
    });
  }).catch(function(err) {
    debug(err);
    res.json({
        status: 'error',
        message: 'Error in fetch all project details',
        details: err
    });
  });
});

router.post('/sendemail', function(req, res) {
  	console.log(req.body);
  	var ress = emailModel.sendEmail(req.body.to,req.body.email_subject,req.body.email_body);
  	res.json({
        status: 'success',
        message: 'Email sent successfully',
        data: ress,
    });
});

module.exports = router;
