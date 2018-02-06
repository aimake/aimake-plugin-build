import webpack from 'webpack';

function initProgress(webpackConfig) {
  let chars = 0;
  webpackConfig.plugins.push(new webpack.ProgressPlugin((_percentage, _msg) => {
    let percentage = _percentage;
    let msg = _msg;
    function lineStart(message) {
      let str = '';
      for (; chars > message.length; chars -= 1) {
        str += '\b \b';
      }
      chars = message.length;
      for (let i = 0; i < chars; i += 1) {
        str += '\b';
      }
      if (str) process.stderr.write(str);
    }
    if (percentage < 1) {
      percentage = Math.floor(percentage * 100);
      msg = `${percentage}% ${msg}`;
    }
    lineStart(msg);
    process.stderr.write(msg);
  }));
}

export default function (webpackConfig) {
  initProgress(webpackConfig);
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }
      console.log(`\n${stats.toString({
        hash: false,
        chunks: false,
        children: false,
        colors: true,
        timings: true,
      })}`);
      return resolve();
    });
  });
}
