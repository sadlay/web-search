// search.test.js
const { bingSearch } = require('./search');
const puppeteer = require('puppeteer');
const { fetchContent } = require('./extract');

// 模拟 puppeteer 和 fetchContent
jest.mock('puppeteer', () => ({
    launch: jest.fn().mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
            goto: jest.fn().mockResolvedValue(true),
            evaluate: jest.fn().mockResolvedValue([
                { href: "https://example.com", title: "Example", abstract: "This is an example." }
            ]),
            close: jest.fn().mockResolvedValue(true),
        }),
        close: jest.fn().mockResolvedValue(true),
    }),
}));

jest.mock('./extract', () => ({
    fetchContent: jest.fn().mockResolvedValue({ content: "Example content" }),
}));

describe('bingSearch function', () => {
    test('fetches search results correctly', async () => {
        const query = "test";
        const results = await bingSearch(query);
        console.log(results);
        expect(results).toHaveLength(1);
        expect(results[0]).toHaveProperty('href', 'https://example.com');
        expect(results[0]).toHaveProperty('title', 'Example');
        expect(results[0]).toHaveProperty('abstract', 'This is an example.');
    });

});

