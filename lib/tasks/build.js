'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (webpackConfig) {
  initProgress(webpackConfig);
  return new _promise2.default(function (resolve, reject) {
    (0, _webpack2.default)(webpackConfig).run(function (err, stats) {
      if (err) {
        return reject(err);
      }
      console.log('\n' + stats.toString({
        hash: false,
        chunks: false,
        children: false,
        colors: true,
        timings: true
      }));
      return resolve();
    });
  });
};

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initProgress(webpackConfig) {
  var chars = 0;
  webpackConfig.plugins.push(new _webpack2.default.ProgressPlugin(function (_percentage, _msg) {
    var percentage = _percentage;
    var msg = _msg;
    function lineStart(message) {
      var str = '';
      for (; chars > message.length; chars -= 1) {
        str += '\b \b';
      }
      chars = message.length;
      for (var i = 0; i < chars; i += 1) {
        str += '\b';
      }
      if (str) process.stderr.write(str);
    }
    if (percentage < 1) {
      percentage = Math.floor(percentage * 100);
      msg = percentage + '% ' + msg;
    }
    lineStart(msg);
    process.stderr.write(msg);
  }));
}

module.exports = exports['default'];