var express = require('express');
var router = express.Router();
var debug = require('debug')('app:routes:project:index');
var verbose = require('debug')('verbose:app:routes:project:index');

var multer = require('multer');

var Cryptr = require('cryptr');
var cryptr = new Cryptr(require('../../cryptokey.json').secret);

var ProjectModel = require('../../models/project/index');
var ApiProjectUpdateModel = require('../../models/api/project/update');

var ProjectFindModel = require('../../models2/project/find');
var LegacyProjectHelperModel = require('../../models2/legacy/project');

var projectFindModel = new ProjectFindModel();
var legacyProjectHelperModel = new LegacyProjectHelperModel();

var UrlsModel = require('../../models2/urls');
var ProxyModel = require('../../models/proxy');
var UserModel = require('../../models2/user');

var urlsModel = new UrlsModel();
var proxyModel = new ProxyModel();
var userModel = new UserModel();

var moment = require('moment');
var format = require('string-format');
var vr = require('variable-replacer');
var latex = require('latex');

var fs = require('fs');
var path = require('path');
var mime = require('mime');

/* GET home page. */
router.get('/:proxyId', function (req, res, next) {
    var proxyId = req.params['proxyId'];
    var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
    var role = proxyIdDecryptSplit[0];
    var projectId = proxyIdDecryptSplit[1];

    projectFindModel.findByAggregated({
        ProjectID: projectId
    }).then(function (result) {
        result = legacyProjectHelperModel.wrapProjectSync(result);
        result.proxyId = proxyId;
        result.role = role;
        userModel.getAllReviewers().then(function(reviewers) {
            result.reviewers = reviewers;
            res.render('templates/project/index', result);
        });
    }).catch(function (err) {
        throw 'Error in fetching project details';
    });
});

router.get('/:proxyId/poster-abstract', function (req, res) {
    var projectModel = new ProjectModel();

    var proxyId = req.params['proxyId'];

    projectModel.getProjectDetails(proxyId, function (err, result) {
        if (err) {
            throw 'Error in fetching project details';
        } else {
            res.render('templates/project/abstract', result);
        }
    });
});

router.get('/:proxyId/poster-abstract/submit', function (req, res) {
    var apiProjectUpdateModel = new ApiProjectUpdateModel();

    var proxyId = req.params['proxyId'];
    var projectId = proxyModel.decryptGetProjectId(proxyModel.roleDecrypt(proxyId));

    var data = {
        projectId: projectId,
        details: {
            "abstract_locked": "true",
            "abstract_submitted_date": moment().format("MMMM D, YYYY")
        }
    };

    apiProjectUpdateModel.update(data, function (err, result) {
        if (err) {
            res.json({
                status: 'error',
                message: 'Error in updating project details',
                details: err
            });
        } else {
            res.redirect('/project/' + proxyId + '/');
        }
    });
});

router.get('/:proxyId/proposal-review', function (req, res, next) {
    var proxyId = req.params['proxyId'];
    var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
    var role = proxyIdDecryptSplit[0];
    var projectId = proxyIdDecryptSplit[1];

    projectFindModel.findByAggregated({
        ProjectID: projectId
    }).then(function (result) {
        result = legacyProjectHelperModel.wrapProjectSync(result);
        result.proxyId = proxyId;
        result.role = role;
        result.urls = urlsModel.getProjectUrlsForId(proxyId);
        result.userId = req && req.user ? req.user.UserID : "";

        if(role == 'mentor' || role == 'student'){
            //result.reviewer = 'r1';
            res.render('templates/project/proposal/reviewerAdmin', result);
        }else if(result.details.r1 == req.user.UserID){
            result.reviewer = 'r1';
            res.render('templates/project/proposal/reviewer1', result);
        }else if(result.details.r2 == req.user.UserID){
            result.reviewer = 'r2';
            res.render('templates/project/proposal/reviewer2', result);
        }
    }).catch(function (err) {
        throw 'Error in fetching project details';
    });
});

router.get('/:proxyId/proposal-text', function (req, res, next) {
    var proxyId = req.params['proxyId'];
    var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
    var role = proxyIdDecryptSplit[0];
    var projectId = proxyIdDecryptSplit[1];

    projectFindModel.findByAggregated({
        ProjectID: projectId
    }).then(function (result) {
        result = legacyProjectHelperModel.wrapProjectSync(result);
        result.proxyId = proxyId;
        result.role = role;
        result.urls = urlsModel.getProjectUrlsForId(proxyId);
        res.render('templates/project/proposal/text', result);
    }).catch(function (err) {
        throw 'Error in fetching project details';
    });
});

router.get('/:proxyId/proposal-text/submit', function (req, res) {
    var apiProjectUpdateModel = new ApiProjectUpdateModel();

    var proxyId = req.params['proxyId'];
    var projectId = proxyModel.decryptGetProjectId(proxyModel.roleDecrypt(proxyId));

    var data = {
        projectId: projectId,
        details: {
            "proposal_locked": "true",
            "proposal_submitted_date": moment().format("MMMM D, YYYY")
        }
    };

    apiProjectUpdateModel.update(data, function (err, result) {
        if (err) {
            res.json({
                status: 'error',
                message: 'Error in updating project details',
                details: err
            });
        } else {
            res.redirect('/project/' + proxyId + '/');
        }
    });
});

router.get('/:proxyId/addmentor', function (req, res, next) {
    var proxyId = req.params['proxyId'];
    var projectId = proxyModel.getProjectId(proxyId);

    projectFindModel.findByAggregated({
        ProjectID: projectId
    }).then(function (result) {
        result = legacyProjectHelperModel.wrapProjectSync(result);
        result.proxyId = proxyId;
        res.render('templates/project/addmentor', result);
    }).catch(function (err) {
        throw 'Error in fetching project details';
    });
});

router.get('/:proxyId/upload', function (req, res) {
    var projectModel = new ProjectModel();

    var proxyId = req.params['proxyId'];
    var uploadType = req.query['type'];

    projectModel.getProjectDetails(proxyId, function (err, result) {
        if (err) {
            throw 'Error in fetching project details';
        } else {
            result.uploadType = uploadType;
            res.render('templates/project/upload', result);
        }
    });
});

var posterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/posters/')
    },
    filename: function (req, file, cb) {
        var proxyId = req.params['proxyId'];
        var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
        var role = proxyIdDecryptSplit[0];
        var projectId = proxyIdDecryptSplit[1];
        cb(null, projectId + path.extname(file.originalname))
    }
});
var posterUpload = multer({
    storage: posterStorage
});

router.post('/:proxyId/upload', posterUpload.single('uploadFile'), function (req, res, next) {
    var apiProjectUpdateModel = new ApiProjectUpdateModel();

    var proxyId = req.params['proxyId'];
    var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
    var role = proxyIdDecryptSplit[0];
    var projectId = proxyIdDecryptSplit[1];
    var uploadType = req.body['uploadType'];

    var data = {
        projectId: projectId,
        details: {
            "poster_submitted": "true",
            "poster_originalname": req.file.originalname
        }
    };

    apiProjectUpdateModel.update(data, function (err, result) {
        if (err) {
            res.json({
                status: 'error',
                message: 'Error in updating project details',
                details: err
            })
        } else {
            res.redirect('/project/' + proxyId + '/');
        }
    });
});

var unicodeReplace = function (s) {
    if (s == undefined || s == null || s == "") {
      return "";
    }

    return s.replace(/‘/g, '``')
        .replace(/’/g, '\'')
        .replace(/“/g, '``')
        .replace(/”/g, '"')
        .replace(/≥/g, '$\\geq$')
        .replace(/≤/g, '$\\leq$')
}

var texReplace = function (s) {
    if (s == undefined || s == null || s == "") {
      return "";
    }

    return s.replace(/\\/g, '\\textbackslash')
        .replace(/\&/g, '\\&')
        .replace(/\%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/~/g, '\\textasciitilde ')
        .replace(/\^/g, '\\textasciicircum')
}

var texUnicodeReplace = function (s) {
    return unicodeReplace(s);
}

router.get('/:proxyId/documents/:type', function (req, res) {
    var projectModel = new ProjectModel();

    var proxyId = req.params['proxyId'];
    var proxyIdDecryptSplit = proxyModel.roleDecryptSplit(proxyId);
    var role = proxyIdDecryptSplit[0];
    var projectId = proxyIdDecryptSplit[1];
    var type = req.params['type'];

    if (type == "poster-abstract") {
        projectFindModel.findByAggregated({
            ProjectID: projectId
        }).then(function (result) {
            result = legacyProjectHelperModel.wrapProjectSync(result);
            try {
                var authorT = "\\author[]{{{} {} ({})}}";
                var authors = result.team.members.concat(result.mentors.members);
                var authorsTex = authors.map(function (a) {
                    return format(authorT, a.FirstName, a.LastName, a.Email);
                }).join('');
                var inlineData = {
                    projectId: result.project.projectId,
                    title: texUnicodeReplace(result.details.symposium_title == undefined 
                                            ? result.details.title : result.details.symposium_title),
                    authors: texUnicodeReplace(authorsTex),
                    date: moment(result.details.abstract_submitted_date).format("MMMM D, YYYY") || moment().format("MMMM D, YYYY"),
                    purpose: texUnicodeReplace(result.details.poster_purpose),
                    methods: texUnicodeReplace(result.details.poster_methods),
                    results: texUnicodeReplace(result.details.poster_results),
                    conclusions: texUnicodeReplace(result.details.poster_conclusions)
                };
                vr({
                    source: 'poster_abstract.tex.tmpl.tex',
                    dest: '/home/builds/poster_abstract-' + projectId + '.tex',
                    inlineData: inlineData
                }, function () {
                    var input = fs.createReadStream('/home/builds/poster_abstract-' + projectId + '.tex');
                    var output = fs.createWriteStream('/homebuilds/poster_abstract-' + projectId + '.pdf');
                    var pdf = latex(input, {
                        command: 'pdflatex'
                    });

                    pdf.pipe(output);
                    pdf.on('error', function (err) {
                        console.log(err);
                    });
                    pdf.on('end', function () {
                        console.log('Done?');
                        var file = fs.createReadStream('/home/builds/poster_abstract-' + projectId + '.pdf');
                        var stat = fs.statSync('/home/builds/poster_abstract-' + projectId + '.pdf');
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=PosterAbstract-' + result.project.projectId + '.pdf');
                        file.pipe(res);
                    })
                });
            } catch (e) {
                res.render('error', {
                    noterror: true,
                    message: 'Abstract could not be generated\n' + e
                });
            }
        }).catch(function (err) {
            res.render('error', {
                noterror: true,
                message: 'Abstract could not be generated\n' + e
            });
        });
    } else if (type == "poster") {
        projectModel.getProjectDetails(proxyId, function (err, result) {
            if (err) {
                throw 'Error in fetching project details';
            } else {
                try {
                    var filename = projectId + path.extname(result.details.poster_originalname);
                    var filepath = '/home/uploads/posters/' + filename;
                    var file = fs.createReadStream(filepath);
                    var stat = fs.statSync(filepath);
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader('Content-Type', mime.getType(filename));
                    res.setHeader('Content-Disposition', 'attachment; filename=Poster-' + result.project.projectId + '.' + mime.getExtension(mime.getType(filename)));
                    file.pipe(res);
                } catch (e) {
                    res.render('error', {
                        noterror: true,
                        message: 'No poster found'
                    });
                }
            }
        });
    } else if (type == "proposal") {
        projectFindModel.findByAggregated({
            ProjectID: projectId
        }).then(function (result) {
            result = legacyProjectHelperModel.wrapProjectSync(result);
            try {
                var authorT = "\\author[]{{{} {} ({})}}";
                var authors = result.team.members.concat(result.mentors.members);
                var authorsTex = authors.map(function (a) {
                    return format(authorT, a.FirstName, a.LastName, a.Email);
                }).join('');
                var studentT = "{} & {} & {}\\\\\\hline";
                var studentsTex = result.team.members.map(function(a) {
                  return format(studentT, a.FirstName, a.LastName, a.Email);
                }).join('\n');
                var inlineData = {
                    projectId: result.project.projectId,
                    title: texReplace(result.details.title),
                    authors: unicodeReplace(authorsTex),
                    teamSize: result.team.members.length,
                    students: unicodeReplace(studentsTex),
                    date: moment(result.details.abstract_submitted_date).format("MMMM D, YYYY") || moment().format("MMMM D, YYYY"),
                    q9: texReplace(result.details.q9),
                    q27: texReplace(result.details.q27),
                    q8: texReplace(result.details.q8),
                    q28text: texReplace(result.details.q28text),
                    projectCategory: texReplace(result.details.projectCategory),
                    q31: texReplace(result.details.q31),
                    q32: texReplace(result.details.q32),
                    q33: texReplace(result.details.q33),
                    q34text: texReplace(result.details.q34text),
                    q37: texReplace(result.details.q37),
                    q35text: texReplace(result.details.q35text),
                    q36: texReplace(result.details.q36),
                    q7: texReplace(result.details.q7),
                    q12p1: texReplace(result.details.q12p1),
                    q12p2: texReplace(result.details.q12p2),
                    q12p3: texReplace(result.details.q12p3),
                    q12p4: texReplace(result.details.q12p4),
                    q12p5: texReplace(result.details.q12p5),
                    q12p6: texReplace(result.details.q12p6),
                    q12p7: texReplace(result.details.q12p7),
                    q12p8: texReplace(result.details.q12p8),
                    q25text: texReplace(result.details.q25text),
                    q23text: texReplace(result.details.q23text),
                    q19text: texReplace(result.details.q19text),
                    q21: texReplace(result.details.q21),
                    q20: texReplace(result.details.q20),
                    q17: texReplace(result.details.q17),
                    q18text: texReplace(result.details.q18text)
                };
                vr({
                    source: 'proposal.tex.tmpl.tex',
                    dest: '/home/builds/proposal-' + projectId + '.tex',
                    variablePattern: /\|([\w._-]+)\|/g,
                    inlineData: inlineData
                }, function () {
                    var input = fs.createReadStream('/home/builds/proposal-' + projectId + '.tex');
                    var output = fs.createWriteStream('/home/builds/proposal-' + projectId + '.pdf');
                    var pdf = latex(input, {
                        command: 'pdflatex'
                    });

                    pdf.pipe(output);
                    pdf.on('error', function (err) {
                        console.log(err);
                    });
                    pdf.on('end', function () {
                        console.log('Done?');
                        var file = fs.createReadStream('/home/builds/proposal-' + projectId + '.pdf');
                        var stat = fs.statSync('/home/builds/proposal-' + projectId + '.pdf');
                        res.setHeader('Content-Length', stat.size);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=Proposal-' + result.project.projectId + '.pdf');
                        file.pipe(res);
                    })
                });
            } catch (e) {
                res.render('error', {
                    noterror: true,
                    message: 'Abstract could not be generated\n' + e
                });
            }
        }).catch(function (err) {
            res.render('error', {
                noterror: true,
                message: 'Abstract could not be generated\n' + e
            });
        });
    } else {
        res.redirect('/project/' + proxyId);
    }
});

module.exports = router;
