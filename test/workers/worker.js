'use strict';

const fs = require('fs');

module.exports = function (fileName, callback) {
  fs.readFile(fileName, 'utf8', callback);
};
