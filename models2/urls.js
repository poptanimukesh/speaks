'use strict';

var UrlsModel = function() {

}

UrlsModel.prototype.getProjectUrlsForId = function(proxyId) {
  var baseUrl = '/project'; // TODO: We shouldn't hardcode this.
  var proxyUrl = '/project' + '/' + proxyId;
  var urls = {
      baseUrl: baseUrl,
      proxyUrl: proxyUrl,
      home: proxyUrl,
      project: proxyUrl,
      abstract: proxyUrl + '/poster-abstract',
      publish: proxyUrl + '/admin-publish',
      viewAbstract: proxyUrl + '/documents/poster-abstract',
      viewPoster: proxyUrl + '/documents/poster',
      viewProposal: proxyUrl + '/documents/proposal',
  };

  // TODO: Need to deprecate this
  urls.proposalUrl = urls.proxyUrl + '/proposal';
  urls.proposal = {
      info: urls.proposalUrl + '/info',
      abstract: urls.proposalUrl + '/abstract',
      text: urls.proposalUrl + '/text',
      outcomes: urls.proposalUrl + '/outcomes',
      citations: urls.proposalUrl + '/citations',
  }

  return urls;
}

module.exports = UrlsModel;
