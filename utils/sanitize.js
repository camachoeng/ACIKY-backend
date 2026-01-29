const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create a DOMPurify instance with jsdom window
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitize HTML content to prevent XSS attacks
const sanitizeHtml = (dirty) => {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    // Configure DOMPurify to allow basic formatting but strip dangerous tags
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a'],
        ALLOWED_ATTR: ['href', 'title', 'target'],
        ALLOW_DATA_ATTR: false
    });
};

// Sanitize plain text (strip all HTML tags)
const sanitizeText = (dirty) => {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    // Strip all HTML tags
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
};

// Sanitize URL to prevent javascript: and data: protocols
const sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }

    const trimmedUrl = url.trim();

    // Block dangerous protocols
    const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
    if (dangerousProtocols.test(trimmedUrl)) {
        return '';
    }

    // Only allow http, https, and relative URLs
    if (!trimmedUrl.match(/^(https?:\/\/|\/)/i)) {
        return '';
    }

    return trimmedUrl;
};

module.exports = {
    sanitizeHtml,
    sanitizeText,
    sanitizeUrl
};
