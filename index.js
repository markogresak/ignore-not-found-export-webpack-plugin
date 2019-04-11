'use strict';

const ModuleDependencyWarning = require('webpack/lib/ModuleDependencyWarning');

const ANY_PATH = /./;

const EXPORT_NOT_FOUND_REG_EXP = /export.*was not found in/;

module.exports = class IgnoreNotFoundExportPlugin {
  /**
   *
   * @param {Object} options
   * @param {RegExp | RegExp[]} [options.include=/./] A list of regular expressions
   */
  constructor({ include = ANY_PATH } = {}) {
    this.include = Array.isArray(include) ? include : [include];
    this.include.forEach((matcher, i) => {
      if (!(matcher instanceof RegExp)) {
        throw new TypeError(
          `IgnoreNotFoundExportPlugin: argument[${i}] must be an instance of RegExp.`,
        );
      }
    });
  }

  isResourcePathAllowed(resourcePath) {
    return this.include.some((regExp) => regExp.test(resourcePath));
  }

  apply(compiler) {
    compiler.hooks.done.tap('IgnoreNotFoundExportPlugin', (stats) => {
      // mutates `compilation.warnings` to remove ignored warnings
      stats.compilation.warnings = stats.compilation.warnings.filter(
        (warning) =>
          !(
            warning instanceof ModuleDependencyWarning &&
            EXPORT_NOT_FOUND_REG_EXP.test(warning.message) &&
            this.isResourcePathAllowed(warning.module.resource)
          ),
      );
    });
  }
};
