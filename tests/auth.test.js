const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

describe('Authentication API', () => {
    // Clean up test users before each test
    beforeEach(async () => {
        await db.query('DELETE FROM users WHERE email LIKE ?', ['test%@example.com']);
    });

    // Close database connection after all tests
    afterAll(async () => {
        await db.query('DELETE FROM users WHERE email LIKE ?', ['test%@example.com']);
        await db.end();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('registered successfully');
            expect(response.body.userId).toBeDefined();
        });

        it('should reject registration with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'not-an-email',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email');
        });

        it('should reject registration with weak password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test2@example.com',
                    password: 'weak'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('8 characters');
        });

        it('should reject registration with invalid username', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'ab', // too short
                    email: 'test3@example.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('3 characters');
        });

        it('should reject registration with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser'
                    // missing email and password
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('required');
        });

        it('should reject duplicate email registration', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser1',
                    email: 'duplicate@example.com',
                    password: 'TestPass123!'
                });

            // Attempt duplicate registration
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: 'duplicate@example.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        // Create a test user before login tests
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'logintest',
                    email: 'testlogin@example.com',
                    password: 'TestPass123!'
                });
        });

        it('should login with correct credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testlogin@example.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('successful');
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe('testlogin@example.com');
            expect(response.body.user.password).toBeUndefined(); // password should not be returned
        });

        it('should reject login with incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testlogin@example.com',
                    password: 'WrongPass123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        it('should reject login with non-existent email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });

        it('should reject login with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'not-an-email',
                    password: 'TestPass123!'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid email');
        });

        it('should reject login with missing fields', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testlogin@example.com'
                    // missing password
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('required');
        });
    });

    describe('GET /api/auth/check', () => {
        it('should return not authenticated for unauthenticated requests', async () => {
            const response = await request(app)
                .get('/api/auth/check');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.isAuthenticated).toBe(false);
        });

        it('should return authenticated status for logged-in users', async () => {
            // Register and login
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'checktest',
                    email: 'testcheck@example.com',
                    password: 'TestPass123!'
                });

            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testcheck@example.com',
                    password: 'TestPass123!'
                });

            // Get session cookie
            const cookies = loginResponse.headers['set-cookie'];

            // Check auth status with session
            const response = await request(app)
                .get('/api/auth/check')
                .set('Cookie', cookies);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.isAuthenticated).toBe(true);
            expect(response.body.user).toBeDefined();
            expect(response.body.user.email).toBe('testcheck@example.com');
        });
    });

    describe('Rate Limiting', () => {
        it('should block excessive login attempts', async () => {
            const attempts = [];

            // Make 6 login attempts (limit is 5)
            for (let i = 0; i < 6; i++) {
                attempts.push(
                    request(app)
                        .post('/api/auth/login')
                        .send({
                            email: 'test@example.com',
                            password: 'TestPass123!'
                        })
                );
            }

            const responses = await Promise.all(attempts);
            const lastResponse = responses[responses.length - 1];

            // Last request should be rate limited
            expect(lastResponse.status).toBe(429);
            expect(lastResponse.body.message).toContain('Too many');
        }, 15000); // Longer timeout for rate limit test
    });
});
