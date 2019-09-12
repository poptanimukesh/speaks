var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:api:project:presentation');

var ApiProjectPresentationModel = require('../../../models/api/project/presentation');

/* GET home page. */
router.get('/:proxyId/presentations/columns', function(req, res, next) {
  var apiProjectPresentationModel = new ApiProjectPresentationModel();

  apiProjectPresentationModel.getColumns({}, function(err, results) {
    res.json({
      status: 'success',
      data: results
    });
  })
});

router.get('/:proxyId/presentations', function(req, res, next) {
  var proxyId = req.params['proxyId'];
  var apiProjectPresentationModel = new ApiProjectPresentationModel();
  var data = {
    proxyId: proxyId
  }
  apiProjectPresentationModel.getAll(data, function(err, results) {
    if (err) {
      res.json({
        status: 'failure',
        err: err
      });
    } else {
      res.json({
        method: 'get',
        status: 'success',
        data: results
      });
    }
  });
});

router.post('/:proxyId/presentation', function(req, res, next) {
  var proxyId = req.params['proxyId'];
  var apiProjectPresentationModel = new ApiProjectPresentationModel();
  var data = {
    proxyId: proxyId,
    meeting: req.body.meeting,
    location: req.body.location,
    date: req.body.date,
    title: req.body.title,
    authors: req.body.authors
  };
  apiProjectPresentationModel.create(data, function(err, results) {
    if (err) {
      res.json({
        status: 'failure',
        err: err
      });
    } else {
      res.json({
        method: 'post',
        status: 'success',
        data: results
      });
    }
  });
});

router.put('/:proxyId/presentation/:presentationId', function(req, res, next) {
  var proxyId = req.params['proxyId'];
  var presentationId = req.params['presentationId'];
  res.json({
    method: 'put',
    proxyId: proxyId,
    data: req.body
  });
});

router.delete('/:proxyId/presentation/:presentationId', function(req, res, next) {
  var proxyId = req.params['proxyId'];
  var presentationId = req.params['presentationId'];
  var apiProjectPresentationModel = new ApiProjectPresentationModel();
  var data = {
    proxyId: proxyId,
    presentationId: presentationId
  };
  apiProjectPresentationModel.delete(data, function(err, results) {
    debug(err);
    debug(results);
    if (err) {
      res.json({
        status: 'failure',
        err: err
      });
    } else {
      res.json({
        method: 'delete',
        status: 'success',
        data: results
      });
    }
  });
});

module.exports = router;
