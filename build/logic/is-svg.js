const _ = require("lodash");

function isSvg(path) {
  return _.isString(path) && !_.isEmpty(path) && /\.svg$/.test(path);
}

module.exports = isSvg;
