const express = require('express');
const { bingSearch } = require('./search');
const { fetchContent } = require('./extract');
const app = express();
const port = 3000;

app.get('/search', async (req, res) => {
    const { query, size = '5', content = 'false' } = req.query;

    // 参数校验
    if (!query) {
        return res.status(400).send({ error: 'A query parameter is required' });
    }

    // 类型转换
    const numericSize = parseInt(size);
    const boolContent = content === 'true';

    try {
        const results = await bingSearch(query, numericSize, boolContent);
        console.log('Search request:', req.query, 'Results:', results); // 控制台打印代替日志
        res.send(results);
    } catch (error) {
        console.error('Error on /search:', error);
        res.status(500).send({ error: "An error occurred while processing your request" });
    }
});

app.get('/content', async (req, res) => {
    const { url, type = 'text', cookie } = req.query;

    if (!url) {
        return res.status(400).send({ error: 'A url parameter is required' });
    }
    try {
        const content = await fetchContent(url, null, type, cookie);
        console.log('Content request:', req.query, 'Content:', content); // 控制台打印代替日志
        res.send(content);
    } catch (error) {
        console.error('Error on /content:', error);
        res.status(500).send({ error: "An error occurred while fetching content" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
