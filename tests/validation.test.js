const { validateEmail, validatePassword, validateUsername } = require('../utils/validation');

describe('Validation Utilities', () => {
    describe('validateEmail', () => {
        it('should validate correct email addresses', () => {
            const result = validateEmail('test@example.com');
            expect(result.valid).toBe(true);
            expect(result.email).toBe('test@example.com');
        });

        it('should trim whitespace from email', () => {
            const result = validateEmail('  test@example.com  ');
            expect(result.valid).toBe(true);
            expect(result.email).toBe('test@example.com');
        });

        it('should reject invalid email formats', () => {
            const invalidEmails = [
                'not-an-email',
                'missing@domain',
                '@nodomain.com',
                'no-at-sign.com',
                'double@@domain.com',
                ''
            ];

            invalidEmails.forEach(email => {
                const result = validateEmail(email);
                expect(result.valid).toBe(false);
                expect(result.message.toLowerCase()).toContain('email');
            });
        });

        it('should reject null or undefined', () => {
            expect(validateEmail(null).valid).toBe(false);
            expect(validateEmail(undefined).valid).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should validate strong passwords', () => {
            const result = validatePassword('StrongPass123!');
            expect(result.valid).toBe(true);
        });

        it('should reject passwords shorter than 8 characters', () => {
            const result = validatePassword('Short1!');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('8 characters');
        });

        it('should reject passwords without uppercase letters', () => {
            const result = validatePassword('lowercase123!');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('uppercase');
        });

        it('should reject passwords without lowercase letters', () => {
            const result = validatePassword('UPPERCASE123!');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('lowercase');
        });

        it('should reject passwords without numbers', () => {
            const result = validatePassword('NoNumbers!');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('number');
        });

        it('should reject passwords without special characters', () => {
            const result = validatePassword('NoSpecial123');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('special character');
        });

        it('should reject null or undefined', () => {
            expect(validatePassword(null).valid).toBe(false);
            expect(validatePassword(undefined).valid).toBe(false);
        });
    });

    describe('validateUsername', () => {
        it('should validate correct usernames', () => {
            const result = validateUsername('validuser123');
            expect(result.valid).toBe(true);
            expect(result.username).toBe('validuser123');
        });

        it('should trim whitespace from username', () => {
            const result = validateUsername('  testuser  ');
            expect(result.valid).toBe(true);
            expect(result.username).toBe('testuser');
        });

        it('should accept usernames with underscores and hyphens', () => {
            expect(validateUsername('test_user').valid).toBe(true);
            expect(validateUsername('test-user').valid).toBe(true);
            expect(validateUsername('test_user-123').valid).toBe(true);
        });

        it('should reject usernames shorter than 3 characters', () => {
            const result = validateUsername('ab');
            expect(result.valid).toBe(false);
            expect(result.message).toContain('3 characters');
        });

        it('should reject usernames longer than 30 characters', () => {
            const result = validateUsername('a'.repeat(31));
            expect(result.valid).toBe(false);
            expect(result.message).toContain('30 characters');
        });

        it('should reject usernames with special characters', () => {
            const invalidUsernames = [
                'user@name',
                'user!name',
                'user name', // space
                'user#123'
            ];

            invalidUsernames.forEach(username => {
                const result = validateUsername(username);
                expect(result.valid).toBe(false);
                expect(result.message).toContain('letters, numbers, underscores, and hyphens');
            });
        });

        it('should reject null or undefined', () => {
            expect(validateUsername(null).valid).toBe(false);
            expect(validateUsername(undefined).valid).toBe(false);
        });
    });
});
