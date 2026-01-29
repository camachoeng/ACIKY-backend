// Test setup file - runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-key';

// Suppress console logs during tests (optional - uncomment if needed)
// global.console = {
//     ...console,
//     log: jest.fn(),
//     error: jest.fn(),
//     warn: jest.fn(),
// };

// Increase timeout for database operations
jest.setTimeout(10000);

// Mock nodemailer to prevent actual emails during tests
jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    })
}));

// Global test utilities
global.testUtils = {
    // Helper to create a test user
    createTestUser: (overrides = {}) => ({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
        ...overrides
    }),

    // Helper to create test credentials
    createTestCredentials: (overrides = {}) => ({
        email: 'test@example.com',
        password: 'TestPass123!',
        ...overrides
    })
};
