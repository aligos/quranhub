import webpack from 'webpack';

const defaultWebpackConfigPath = '../../webpack/prod.config';

export default (clientFile, webpackConfigPath = defaultWebpackConfigPath) => {
  const webpackConfig = require(webpackConfigPath);
  webpackConfig.entry.main.push(clientFile);
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    } else {
      console.log(stats.toString("minimal"));
    }
  });
};
