# Test Suite Documentation

This directory contains automated tests for the ACIKY Yoga Backend API.

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with verbose output
```bash
npm run test:verbose
```

## Test Files

### `validation.test.js`
Unit tests for input validation utilities:
- Email format validation
- Password strength validation
- Username validation

**Coverage:** 100% of validation logic

### `sanitize.test.js`
Unit tests for sanitization utilities:
- HTML sanitization (prevents XSS)
- Text sanitization (strips all HTML)
- URL sanitization (blocks dangerous protocols)

**Coverage:** All sanitization functions

### `auth.test.js`
Integration tests for authentication endpoints:
- User registration
- User login
- Authentication status checking
- Rate limiting

**Coverage:** `/api/auth/*` endpoints

## Test Structure

Each test file follows this pattern:

```javascript
describe('Feature Name', () => {
    // Setup code (runs before tests)
    beforeEach(async () => {
        // Clean up test data
    });

    // Cleanup code (runs after tests)
    afterAll(async () => {
        // Close connections
    });

    describe('Specific Functionality', () => {
        it('should do something expected', async () => {
            // Test code
            expect(result).toBe(expected);
        });
    });
});
```

## Writing New Tests

### Unit Test Example
```javascript
const { functionToTest } = require('../path/to/module');

describe('Module Name', () => {
    it('should return expected value', () => {
        const result = functionToTest(input);
        expect(result).toBe(expected);
    });
});
```

### API Integration Test Example
```javascript
const request = require('supertest');
const app = require('../server');

describe('POST /api/endpoint', () => {
    it('should return 200 with valid data', async () => {
        const response = await request(app)
            .post('/api/endpoint')
            .send({ data: 'value' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
```

## Test Database

Tests run against the same database as development. Before each test:
- Test data is cleaned up using email pattern `test%@example.com`
- Each test suite manages its own cleanup

**Important:** Never use real user emails in tests!

## Common Assertions

```javascript
// Status codes
expect(response.status).toBe(200);

// Response structure
expect(response.body.success).toBe(true);
expect(response.body.data).toBeDefined();

// String content
expect(message).toContain('expected text');
expect(email).toMatch(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);

// Arrays
expect(array).toHaveLength(3);
expect(array).toContain(item);

// Objects
expect(object).toHaveProperty('key');
expect(object).toEqual({ key: 'value' });
```

## Coverage Reports

After running `npm run test:coverage`, check:
- **Terminal output** - Summary of coverage percentages
- **coverage/** directory - Detailed HTML reports (open `coverage/lcov-report/index.html`)

## Best Practices

1. **Isolation** - Each test should be independent
2. **Cleanup** - Always clean up test data
3. **Descriptive names** - Test names should explain what they test
4. **One assertion per test** - Or at least, one concept per test
5. **Use beforeEach/afterEach** - For setup and cleanup
6. **Mock external services** - Don't send real emails or make real payments

## Troubleshooting

### Tests hang or don't exit
- Check for open database connections
- Ensure `afterAll` closes all connections
- Use `--forceExit` flag (already in npm test script)

### Database errors
- Ensure MySQL is running
- Check `.env` has correct test database credentials
- Verify test user cleanup is working

### Rate limit tests fail
- These tests take longer (15s timeout set)
- Run individually if needed: `npm test -- auth.test.js`

## Next Steps

To expand test coverage, consider adding tests for:
- [ ] Blog endpoints (`/api/blog`)
- [ ] Activity endpoints (`/api/activities`)
- [ ] Space endpoints (`/api/spaces`)
- [ ] Gallery endpoints (`/api/gallery`)
- [ ] Testimonial endpoints (`/api/testimonials`)
- [ ] Error handling middleware
- [ ] Rate limiting on all endpoints
