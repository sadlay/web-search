const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const axios = require('axios');
const puppeteer = require('puppeteer');
var breakdance = require('breakdance');

async function fetchContent(url, providedBrowser = null, type = 'text', cookieStr = null) {
    let htmlContent = '';
    let browser = providedBrowser;
    let result = {};
    try {
        // 如果没有提供浏览器实例，则新建一个
        if (!browser) {
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
        }
        const page = await browser.newPage();

        // 如果提供了cookie字符串，将其设置到页面中
        if (cookieStr) {
            const cookies = cookieStr.split(';').map(pair => {
                const [name, value] = pair.split('=').map(c => c.trim());
                return { name, value, url }; // 根据Puppeteer的要求设置cookie对象
            });
            await Promise.all(cookies.map(cookie => page.setCookie(cookie)));
        }

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
        htmlContent = await page.content();
        await page.close();

        // 使用Readability解析网页内容
        const dom = new JSDOM(htmlContent, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        let content;
        if (type === 'html') {
            content = article ? article.content : '';
        } else if (type === 'markdown') {
            // 使用breakdance转换HTML到Markdown
            content = article ? breakdance(article.content) : '';
        } else {
            content = article ? article.textContent : '';
        }
        result = {
            content: content,
            title: article ? article.title : '',
            byline: article ? article.byline : '',
            length: article ? article.length : 0,
            excerpt: article ? article.excerpt : '',
            siteName: article ? article.siteName : '',
            publishedTime: article ? article.publishedTime : '',
        };
    } catch (error) {
        console.error(`Error fetching content from ${url}:`, error);
        throw error; // Re-throw the error so it can be handled upstream
    } finally {
        // 如果是内部创建的浏览器实例，完成后关闭它
        if (!providedBrowser) {
            await browser.close();
        }
    }
    return result;
}

module.exports = { fetchContent };
