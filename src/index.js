import fse from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import aimakeWebpackConfig from 'webpack-config-aimake';
import build from './tasks/build';
import clean from './tasks/clean';

const rootDir = process.cwd();
process.noDeprecation = true;
process.env.NODE_ENV = 'production';

function getWebpackOptions(aimakeOptions, options) {
  let webpackOptions;
  if (!aimakeOptions.webpack) {
    webpackOptions = {};
  }
  // 合并配置
  webpackOptions = _.merge({
    appName: aimakeOptions.appName || '',
    needNameSpace: aimakeOptions.needNameSpace,
    projectType: aimakeOptions.projectType, // 项目类型
    libType: aimakeOptions.libType, // 框架类型
    env: options.env,
    baseUrl: options.baseUrl,
    sourceMap: false, // source map
  }, aimakeOptions.webpack);

  // 支持云构建
  if (process.env.BUILD_DEST) {
    webpackOptions.outputPath = process.env.BUILD_DEST;
  }

  return webpackOptions;
}

// 用户端自定义Webpack配置
function clientWebpackConfig(config) {
  let newConfig;
  try {
    newConfig = require(path.join(rootDir, 'webpack.config.js'))(config);
  } catch (e) {
    newConfig = null;
  }
  return newConfig || config;
}

async function execute(config) {
  const {
    aimakeOptions,
    options,
    webpackConfig,
    webpackOptions,
  } = config;
  if (!(aimakeOptions.webpack.buildRemove === false)) {
    await clean(webpackOptions);
  }
  await build(webpackConfig);
}

export default {
  // 定义命令选项
  options: [
    ['-i, --inline', '资源内联'],
    ['-b, --baseUrl <baseUrl>', '静态资源基础URL'],
    ['-e, --env <env>', '静态资源环境'],
  ],
  run(argument, options) {
    // argument 命令参数 options  命令配置
    // 用户配置
    let aimakeOptions;
    try {
      aimakeOptions = require(path.join(rootDir, '.aimake'));
    } catch (e) {
      try {
        aimakeOptions = fse.readJsonSync(path.join(rootDir, '.aimake'));
      } catch (err) {
        aimakeOptions = {};
      }
    }

    // 获取 Webpack 配置（合并用户配置和命令行配置）
    const webpackOptions = getWebpackOptions(aimakeOptions, options);

    // 根据配置生成WebpackConfig
    const webpackConfig = clientWebpackConfig(aimakeWebpackConfig(webpackOptions));
    try {
      execute({
        options,
        aimakeOptions,
        webpackConfig,
        webpackOptions,
      });
    } catch (e) {
      console.log(e);
    }
  },
};
