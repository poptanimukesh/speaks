

var projectsGetUrl = '/api/v1/admin/projects';

$.get(projectsGetUrl).done(function(result) {
	console.log('res :' + result);
});