import del from 'del';

export default function (options) {
  return del([options.outputPath], { dot: true });
}
