const { bingSearch } = require('../src/search');

describe('bingSearch Integration Test', () => {
    jest.setTimeout(30000); // 设置较长的超时时间，因为启动浏览器和页面加载需要时间

    test('should return search results for a query', async () => {
        const query = '遥遥领先是什么梗';
        const results = await bingSearch(query, 2, false);
        console.log(results);
        // 检查是否返回了结果
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);

        // 检查每个结果是否有标题和链接
        results.forEach(result => {
            expect(result).toHaveProperty('title');
            expect(result.title.length).toBeGreaterThan(0);
            expect(result).toHaveProperty('href');
            expect(result.href.length).toBeGreaterThan(0);
        });
    });
});
