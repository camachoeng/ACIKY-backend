module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Coverage collection
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'utils/**/*.js',
        '!**/node_modules/**'
    ],

    // Coverage thresholds (optional - can be adjusted)
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },

    // Transform ignore patterns for node_modules (allow ES modules)
    transformIgnorePatterns: [
        'node_modules/(?!(@exodus|encoding)/)'
    ],

    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.js'
    ],

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

    // Verbose output
    verbose: true,

    // Timeout for tests (5 seconds)
    testTimeout: 5000,

    // Clear mocks between tests
    clearMocks: true,

    // Force exit after tests complete
    forceExit: true,

    // Detect open handles
    detectOpenHandles: true
};
