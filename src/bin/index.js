import program from 'commander';
import aimakePluginBuild from '../index';
import pkg from '../../package.json';

program
  .version(pkg.version)
  .usage('<command> [options]')
  .option('-i, --inline', 'inline')
  .option('-b, --baseUrl <baseUrl>', 'baseUrl')
  .option('-e, --env <env>', 'env')
  .parse(process.argv);

const options = {
  inline: program.inline,
  baseUrl: program.baseUrl,
  env: program.env,
};

aimakePluginBuild.run(null, options);
