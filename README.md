# 搜索引擎和网页内容提取API

## 用途

主要用于为大模型提供外部工具。

原因：搜索API例如SerpApi免费额度较少，而且比较贵（穷屌丝一枚）。

## 原理

使用无头浏览器访问搜索引擎（目前是必应），然后提取网页内容。

## 使用

### Docker启动（推荐）

```shell
docker run -p 3000:3000 --name web-search --restart unless-stopped -d sadlay/web-search:latest
```

如果是在生产环境中使用，可以通过环境变量设置端口和基础URL。

```shell
docker run -e PORT=8080 -e BASE_URL='https://your-domain.com' -p 8080:8080 sadlay/web-search:latest
```

### 本地启动

需要Node-20以上版本。

```shell
# clone代码
git https://github.com/sadlay/web-search.git

# 进入目录
cd web-search

# 复制配置文件
cp .env.example .env

# 安装依赖
npm install

# 启动服务
node server.js
````

## 接口

### 搜索

请求示例
```shell
http://localhost:3000/search?query=python
```

`参数说明`
- query: 搜索关键词
- size: 返回结果数量，默认为5
- content: 是否返回网页链接内容，默认为false

### 内容提取

`请求示例`

```shell
http://localhost:3000/content?url=https://zh.wikipedia.org/wiki/Python
```

`参数说明`
- url: 网页链接
- type: 返回内容类型，默认为text。可选值：text, html, markdown
- cookie: 网页cookie，用于访问需要登录的网站

