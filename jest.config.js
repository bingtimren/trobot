module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!src/main.ts",
    "!src/integration/**"
  ],
};