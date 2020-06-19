const VirtualModulesPlugin = require("webpack-virtual-modules");

module.exports = class EvalWebpackPlugin {
  /**
   * Evaluate a module as part of the webpack build.
   *
   * @param {string} filePath
   * @param {() => any} getValue
   * @param {{ pollInterval?: number }} options
   */
  constructor(filePath, getValue, options = {}) {
    this.filePath = filePath;
    this.getValue = getValue;
    this.options = Object.assign({}, options, {
      pollInterval: 1000,
    });

    this.evaluated = "";
    this.virtualModulesPlugin = new VirtualModulesPlugin({
      [filePath]: "{}", // Unused, since data is replaced immediately
    });
  }

  apply(compiler) {
    this.virtualModulesPlugin.apply(compiler);

    setInterval(() => {
      this.update();
    }, this.options.pollInterval);

    compiler.hooks.compilation.tap("EvalWebpackPlugin", (compilation) => {
      this.update();
    });
  }

  update() {
    const object = this.getValue();
    const json = JSON.stringify(object);

    // Check if the data changed
    if (json === this.evaluated) return;

    this.evaluated = json;

    const source = `module.exports = ${json}

if (module.hot) {
  module.hot.decline()
}`;

    this.virtualModulesPlugin.writeModule(this.filePath, source);
  }
};
