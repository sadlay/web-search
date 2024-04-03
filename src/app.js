const express = require('express');
const { bingSearch } = require('./search');
const { fetchContent } = require('./extract');
const { isValidHttpUrl } = require('./util')
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static('public'));

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
        const results = await bingSearch(query.trim(), numericSize, boolContent);
        console.log('Search request:', req.query, 'Results:', results);
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
    if (isValidHttpUrl(url) === false) {
        return res.status(400).send({ error: 'The url parameter must be a valid HTTP or HTTPS URL' });
    }

    try {
        const content = await fetchContent(url, null, type, cookie);
        console.log('Content request:', req.query, 'Content:', content);
        res.send(content);
    } catch (error) {
        console.error('Error on /content:', error);
        res.status(500).send({ error: "An error occurred while fetching content" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
