const { isValidHttpUrl } = require('../src/util');

describe('isValidHttpUrl', () => {
    test('returns true for valid http URL', () => {
        expect(isValidHttpUrl('http://example.com')).toBe(true);
    });

    test('returns true for valid https URL', () => {
        expect(isValidHttpUrl('https://example.com')).toBe(true);
    });

    test('returns false for invalid URL', () => {
        expect(isValidHttpUrl('ftp://example.com')).toBe(false);
    });

    test('returns false for non-URL string', () => {
        expect(isValidHttpUrl('not a url')).toBe(false);
    });

    test('returns false for empty string', () => {
        expect(isValidHttpUrl('')).toBe(false);
    });
});
