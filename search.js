const puppeteer = require('puppeteer');
const { fetchContent } = require('./extract');

async function bingSearch(query, size = 5, content = false) {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    try {
        const page = await browser.newPage();
        await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}&cc=US`, { timeout: 5000 });
        const summaries = await page.evaluate((max) => {
            const liElements = Array.from(document.querySelectorAll("#b_results > .b_algo"));
            return liElements.slice(0, max).map((li) => {
                const abstractElement = li.querySelector(".b_caption > p");
                const linkElement = li.querySelector("a");
                return {
                    href: linkElement.getAttribute("href"),
                    title: linkElement.textContent,
                    abstract: abstractElement ? abstractElement.textContent : ""
                };
            });
        }, size);
        await page.close();
        if (content) {
            // 使用相同的浏览器实例来获取所有搜索结果的内容
            const contentPromises = summaries.map(summary =>
                fetchContent(summary.href, browser)
                    .then(result => result.content) // 仅返回内容文本
                    .catch(error => ({ error: error.toString() }))
            );
            const contents = await Promise.all(contentPromises);
            return summaries.map((summary, index) => ({ ...summary, content: contents[index] }));
        } else {
            return summaries;
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { bingSearch };
