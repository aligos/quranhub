var commonPresets = [
  require("babel-preset-react"),
  require("babel-preset-es2015"),
  require("babel-preset-stage-0")
];

var commonPlugins = [
  require("babel-plugin-transform-runtime"),
  require("babel-plugin-add-module-exports"),
  require("babel-plugin-transform-decorators-legacy").default,
  require("babel-plugin-transform-react-display-name")
];

// XXX: can we include react-hmre as a development preset?

module.exports = {
  presets: commonPresets,
  plugins: commonPlugins
};
