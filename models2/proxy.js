'use strict';

var Cryptr = require('cryptr');

var cryptokey = require('../cryptokey.json');
var cryptr = new Cryptr(cryptokey.secret);

var ProxyModel = function() {

}

ProxyModel.prototype.createProxyIdForRole = function(role, projectId) {
    return cryptr.encrypt(role + ':' + projectId);
};

ProxyModel.prototype.createProxyIds = function(projectId) {
    return {
        admin: this.createProxyIdForRole('admin', projectId),
        mentor: this.createProxyIdForRole('mentor', projectId),
        student: this.createProxyIdForRole('student', projectId)
    }
};

ProxyModel.prototype.roleEncrypt = function(role, projectId) {
  return this.createProxyIdForRole(role, projectId);
}

ProxyModel.prototype.roleDecrypt = function(proxyId) {
  return cryptr.decrypt(proxyId);
}

ProxyModel.prototype.roleDecryptSplit = function(proxyId) {
  return cryptr.decrypt(proxyId).split(':');
}

ProxyModel.prototype.decryptSplit = function(proxyIdDecrypt) {
  return proxyIdDecrypt.split(":");
}

ProxyModel.prototype.decryptGetRole = function(proxyIdDecrypt) {
  return proxyIdDecrypt.split(":")[0];
}

ProxyModel.prototype.decryptGetProjectId = function(proxyIdDecrypt) {
  return proxyIdDecrypt.split(":")[1];
}

ProxyModel.prototype.getProjectId = function(proxyId) {
  return this.decryptGetProjectId(this.roleDecrypt(proxyId));
}

module.exports = ProxyModel;
