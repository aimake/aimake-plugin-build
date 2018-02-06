'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(_package2.default.version).usage('<command> [options]').option('-i, --inline', 'inline').option('-b, --baseUrl <baseUrl>', 'baseUrl').option('-e, --env <env>', 'env').parse(process.argv);

var options = {
  inline: _commander2.default.inline,
  baseUrl: _commander2.default.baseUrl,
  env: _commander2.default.env
};

_index2.default.run(null, options);