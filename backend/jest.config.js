module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 30000,
  forceExit: true,        // Force exit after tests
  detectOpenHandles: true, // Detect open handles
  verbose: true
};