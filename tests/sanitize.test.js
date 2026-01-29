const { sanitizeHtml, sanitizeText, sanitizeUrl } = require('../utils/sanitize');

describe('Sanitization Utilities', () => {
    describe('sanitizeText', () => {
        it('should strip all HTML tags from text', () => {
            const dirty = '<script>alert("xss")</script>Hello World';
            const clean = sanitizeText(dirty);
            expect(clean).toBe('Hello World');
        });

        it('should remove dangerous script tags', () => {
            const dirty = 'Normal text <script>malicious()</script> more text';
            const clean = sanitizeText(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).not.toContain('malicious');
        });

        it('should strip bold and italic tags', () => {
            const dirty = '<strong>Bold</strong> and <em>italic</em>';
            const clean = sanitizeText(dirty);
            expect(clean).toBe('Bold and italic');
        });

        it('should return empty string for null or undefined', () => {
            expect(sanitizeText(null)).toBe('');
            expect(sanitizeText(undefined)).toBe('');
        });

        it('should handle already clean text', () => {
            const clean = 'Just plain text';
            expect(sanitizeText(clean)).toBe('Just plain text');
        });
    });

    describe('sanitizeHtml', () => {
        it('should allow safe HTML tags', () => {
            const dirty = '<p>Paragraph</p><strong>Bold</strong>';
            const clean = sanitizeHtml(dirty);
            expect(clean).toContain('<p>');
            expect(clean).toContain('<strong>');
        });

        it('should remove script tags', () => {
            const dirty = '<p>Text</p><script>alert("xss")</script>';
            const clean = sanitizeHtml(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).not.toContain('alert');
        });

        it('should remove onclick and other event handlers', () => {
            const dirty = '<button onclick="malicious()">Click</button>';
            const clean = sanitizeHtml(dirty);
            expect(clean).not.toContain('onclick');
            expect(clean).not.toContain('malicious');
        });

        it('should allow safe link attributes', () => {
            const dirty = '<a href="https://example.com" title="Link">Click</a>';
            const clean = sanitizeHtml(dirty);
            expect(clean).toContain('href');
            expect(clean).toContain('example.com');
        });

        it('should return empty string for null or undefined', () => {
            expect(sanitizeHtml(null)).toBe('');
            expect(sanitizeHtml(undefined)).toBe('');
        });
    });

    describe('sanitizeUrl', () => {
        it('should allow https URLs', () => {
            const url = 'https://example.com/image.jpg';
            expect(sanitizeUrl(url)).toBe(url);
        });

        it('should allow http URLs', () => {
            const url = 'http://example.com/image.jpg';
            expect(sanitizeUrl(url)).toBe(url);
        });

        it('should allow relative URLs', () => {
            const url = '/images/photo.jpg';
            expect(sanitizeUrl(url)).toBe(url);
        });

        it('should block javascript: protocol', () => {
            const url = 'javascript:alert("xss")';
            expect(sanitizeUrl(url)).toBe('');
        });

        it('should block data: protocol', () => {
            const url = 'data:text/html,<script>alert("xss")</script>';
            expect(sanitizeUrl(url)).toBe('');
        });

        it('should block vbscript: protocol', () => {
            const url = 'vbscript:msgbox("xss")';
            expect(sanitizeUrl(url)).toBe('');
        });

        it('should block file: protocol', () => {
            const url = 'file:///etc/passwd';
            expect(sanitizeUrl(url)).toBe('');
        });

        it('should return empty string for null or undefined', () => {
            expect(sanitizeUrl(null)).toBe('');
            expect(sanitizeUrl(undefined)).toBe('');
        });

        it('should return empty string for invalid protocols', () => {
            expect(sanitizeUrl('ftp://example.com')).toBe('');
            expect(sanitizeUrl('telnet://example.com')).toBe('');
        });

        it('should trim whitespace', () => {
            const url = '  https://example.com/image.jpg  ';
            expect(sanitizeUrl(url)).toBe('https://example.com/image.jpg');
        });
    });
});
