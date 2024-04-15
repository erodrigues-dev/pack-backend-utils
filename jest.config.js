/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'test-reports',
  coverageProvider: 'v8',
  coverageReporters: ['html', 'lcov', 'text', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
  ],
}
