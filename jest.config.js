/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'test-reports',
  coverageProvider: 'v8',
  coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: ['lib/**/*.js', '!lib/**/index.js'],
}

export default config
