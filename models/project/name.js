'use strict';

var NameModel = function() {

}

NameModel.prototype.formatStandard = function(lastName, firstName, email) {
  return firstName + " " + lastName + " (" + email + ")";
}

module.exports = NameModel;
