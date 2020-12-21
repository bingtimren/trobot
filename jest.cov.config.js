const baseConfig = require("./jest.config")
module.exports = {
    ...baseConfig,
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: -10
      }
    },
  };