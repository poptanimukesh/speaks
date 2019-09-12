var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api_v1:search:index');

var SearchModel = require('../../../models/api/search');

var LecturerFindModel = require('../../../models2/lecturer/find');
var lecturerFindModel = new LecturerFindModel();

router.get('/lecturers', function(req, res, next) {
  var searchModel = new SearchModel();
  var email = req.query['email'];
  lecturerFindModel.findBy({
    Email: email
  }).then(function(result) {
    var lecturer = {};
    console.log(result);
    if (result != undefined) {
      lecturer = {
        lecturerId: result.LecturerID,
        email: result.Email,
        firstName: result.FirstName,
        lastName: result.LastName,
        phoneNumber: result.Phone,
        jobTitle: result.Title,
        workplace: result.Institution,
        status: result.Status
      }
    }
    res.json({
      status: 'success',
      data: lecturer
    });
  }).catch(function(err) {
    res.json({
      status: 'failure',
      err: err
    });
  })
});

module.exports = router;
