'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var execute = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(config) {
    var aimakeOptions, webpackConfig, webpackOptions;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            aimakeOptions = config.aimakeOptions, webpackConfig = config.webpackConfig, webpackOptions = config.webpackOptions;

            if (aimakeOptions.webpack.buildRemove === false) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return (0, _clean2.default)(webpackOptions);

          case 4:
            _context.next = 6;
            return (0, _build2.default)(webpackConfig);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function execute(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _webpackConfigAimake = require('webpack-config-aimake');

var _webpackConfigAimake2 = _interopRequireDefault(_webpackConfigAimake);

var _build = require('./tasks/build');

var _build2 = _interopRequireDefault(_build);

var _clean = require('./tasks/clean');

var _clean2 = _interopRequireDefault(_clean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootDir = process.cwd();
process.noDeprecation = true;
process.env.NODE_ENV = 'production';

function getWebpackOptions(aimakeOptions, options) {
  var webpackOptions = void 0;
  if (!aimakeOptions.webpack) {
    webpackOptions = {};
  }
  // 合并配置
  webpackOptions = _lodash2.default.merge({
    appName: aimakeOptions.appName || '',
    needNameSpace: aimakeOptions.needNameSpace,
    projectType: aimakeOptions.projectType, // 项目类型
    libType: aimakeOptions.libType, // 框架类型
    env: options.env,
    baseUrl: options.baseUrl,
    sourceMap: false // source map
  }, aimakeOptions.webpack);

  // 支持云构建
  if (process.env.BUILD_DEST) {
    webpackOptions.outputPath = process.env.BUILD_DEST;
  }

  return webpackOptions;
}

// 用户端自定义Webpack配置
function clientWebpackConfig(config) {
  var newConfig = void 0;
  try {
    newConfig = require(_path2.default.join(rootDir, 'webpack.config.js'))(config);
  } catch (e) {
    newConfig = null;
  }
  return newConfig || config;
}

exports.default = {
  // 定义命令选项
  options: [['-i, --inline', '资源内联'], ['-b, --baseUrl <baseUrl>', '静态资源基础URL'], ['-e, --env <env>', '静态资源环境']],
  run: function run(argument, options) {
    // argument 命令参数 options  命令配置
    // 用户配置
    var aimakeOptions = void 0;
    try {
      aimakeOptions = require(_path2.default.join(rootDir, '.aimake'));
    } catch (e) {
      try {
        aimakeOptions = _fsExtra2.default.readJsonSync(_path2.default.join(rootDir, '.aimake'));
      } catch (err) {
        aimakeOptions = {};
      }
    }

    // 获取 Webpack 配置（合并用户配置和命令行配置）
    var webpackOptions = getWebpackOptions(aimakeOptions, options);

    // 根据配置生成WebpackConfig
    var webpackConfig = clientWebpackConfig((0, _webpackConfigAimake2.default)(webpackOptions));
    try {
      execute({
        options: options,
        aimakeOptions: aimakeOptions,
        webpackConfig: webpackConfig,
        webpackOptions: webpackOptions
      });
    } catch (e) {
      console.log(e);
    }
  }
};
module.exports = exports['default'];